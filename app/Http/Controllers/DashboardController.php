<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class DashboardController extends Controller
{
    //
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $userId = $user->id;
        $isAdmin = $user->hasRole('admin');

        $adminAwareQueryBuilder = function ($query) use ($userId, $isAdmin) {
            if (!$isAdmin) {
                $query->where('user_wallets.user_id', $userId);
            }
        };

        $balanceQuery = DB::table('user_wallets');
        if (!$isAdmin) {
            $balanceQuery->where('user_id', $userId);
        }
        $totalBalance = $balanceQuery->sum('balance');

        $currentMonthExpensesQuery = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->where('transactions.type', 'debit')
            ->whereMonth('transactions.date', now()->month)
            ->whereYear('transactions.date', now()->year);
        $adminAwareQueryBuilder($currentMonthExpensesQuery);
        $currentMonthExpenses = $currentMonthExpensesQuery->sum('transactions.amount');

        $previousMonthExpensesQuery = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->where('transactions.type', 'debit')
            ->whereMonth('transactions.date', now()->subMonth()->month)
            ->whereYear('transactions.date', now()->subMonth()->year);
        $adminAwareQueryBuilder($previousMonthExpensesQuery);
        $previousMonthExpenses = $previousMonthExpensesQuery->sum('transactions.amount');

        $percentageChange = $previousMonthExpenses > 0 ? (($currentMonthExpenses - $previousMonthExpenses) / $previousMonthExpenses) * 100 : 0;

        $expensesByCategoryQuery = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->select('transactions.description as name', DB::raw('SUM(transactions.amount) as amount'))
            ->where('transactions.type', 'debit')
            ->whereMonth('transactions.date', now()->month)
            ->whereYear('transactions.date', now()->year)
            ->where('user_wallets.user_id', $userId); // Selalu pakai userId

        $expensesByCategory = $expensesByCategoryQuery->groupBy('transactions.description')
            ->orderByDesc('amount')
            ->limit(5)
            ->get();

        $totalExpenses = $expensesByCategory->sum('amount');
        $colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-gray-500'];
        $expensesByCategory = $expensesByCategory->map(function ($category, $index) use ($totalExpenses, $colors) {
            $category->percentage = $totalExpenses > 0 ? round(($category->amount / $totalExpenses) * 100) : 0;
            $category->color = $colors[$index % count($colors)];
            return $category;
        });

        $recentTransactionsQuery = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->select('transactions.id', 'transactions.description as name', 'transactions.amount', 'transactions.description as category', DB::raw('DATE_FORMAT(transactions.date, "%d %b") as date'), 'transactions.type')
            ->where('user_wallets.user_id', $userId); // Selalu pakai userId

        $recentTransactions = $recentTransactionsQuery->orderByDesc('transactions.date')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                $transaction->amount = $transaction->type === 'debit' ? -1 * $transaction->amount : $transaction->amount;
                $iconColor = 'text-gray-500';
                if (stripos($transaction->category, 'food') !== false || stripos($transaction->category, 'makan') !== false) {
                    $iconColor = 'text-yellow-500';
                } elseif (stripos($transaction->category, 'transport') !== false) {
                    $iconColor = 'text-blue-500';
                } elseif (stripos($transaction->category, 'bill') !== false || stripos($transaction->category, 'tagihan') !== false) {
                    $iconColor = 'text-red-500';
                } elseif ($transaction->type !== 'debit') {
                    $iconColor = 'text-green-500';
                }
                $transaction->icon_color = $iconColor;
                return $transaction;
            });

        $upcomingPaymentsQuery = DB::table('budget_plans')
            ->where('end_date', '>=', now())
            ->where('user_id', $userId); // Selalu pakai userId

        $upcomingPayments = $upcomingPaymentsQuery->orderBy('end_date')
            ->limit(3)
            ->get()
            ->map(function ($plan) {
                return ['id' => $plan->id, 'name' => $plan->name, 'amount' => $plan->total_budget, 'date' => date('d M', strtotime($plan->end_date)), 'priority' => strtotime($plan->end_date) - time() < 7 * 24 * 60 * 60 ? 'high' : 'medium'];
            });

        $activeCategoriesQuery = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->select(DB::raw('COUNT(DISTINCT transactions.description) as count'))
            ->whereMonth('transactions.date', now()->month)
            ->whereYear('transactions.date', now()->year);
        $adminAwareQueryBuilder($activeCategoriesQuery);
        $activeCategories = $activeCategoriesQuery->first()->count;

        $incomeExpenseChartData = $this->prepareIncomeExpenseChartData($userId, $isAdmin);
        $expensesByCategoryData = $this->prepareExpenseByCategoryData($userId, $isAdmin);
        $walletBalanceData = $this->prepareWalletBalanceData($userId, $isAdmin);

        return Inertia::render('Dashboard/Index', [
            'dashboardData' => [
                'balance' => ['total' => $totalBalance, 'change' => round($percentageChange, 1), 'isPositive' => $percentageChange <= 0],
                'chartData' => ['incomeExpenseChartData' => $incomeExpenseChartData, 'expensesByCategoryData' => $expensesByCategoryData, 'walletBalanceData' => $walletBalanceData],
                'expensesByCategory' => $expensesByCategory,
                'recentTransactions' => $recentTransactions,
                'upcomingPayments' => $upcomingPayments,
                'activeCategories' => $activeCategories ?? 0,
            ]
        ]);
    }

    private function prepareIncomeExpenseChartData($userId, $isAdmin)
    {
        $startDate = Carbon::now()->subDays(29)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $query = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->select(
                DB::raw('DATE(transactions.date) as transaction_date'),
                'transactions.type',
                DB::raw('SUM(transactions.amount) as total_amount')
            )
            ->where('transactions.date', '>=', $startDate)
            ->where('transactions.date', '<=', $endDate);

        if (!$isAdmin) {
            $query->where('user_wallets.user_id', $userId);
        }

        $transactions = $query->groupBy('transaction_date', 'transactions.type')
            ->orderBy('transaction_date')
            ->get();

        $chartDataMap = [];
        foreach ($transactions as $transaction) {
            $date = $transaction->transaction_date;
            if (!isset($chartDataMap[$date])) {
                $chartDataMap[$date] = [
                    'date' => Carbon::parse($date)->format('d M'),
                    'income' => 0,
                    'expense' => 0,
                ];
            }
            if ($transaction->type == 'credit') {
                $chartDataMap[$date]['income'] = round($transaction->total_amount);
            } elseif ($transaction->type == 'debit') {
                $chartDataMap[$date]['expense'] = round($transaction->total_amount);
            }
        }

        $finalChartData = array_values($chartDataMap);
        $maxIncome = $transactions->where('type', 'credit')->max('total_amount') ?? 0;
        $maxExpense = $transactions->where('type', 'debit')->max('total_amount') ?? 0;

        return [
            'data' => $finalChartData,
            'maxValue' => max($maxIncome, $maxExpense, 1) * 1.1
        ];
    }

    private function prepareExpenseByCategoryData($userId, $isAdmin)
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $query = DB::table('transactions')
            ->join('user_wallets', 'transactions.user_wallet_id', '=', 'user_wallets.id')
            ->select('transactions.description as name', DB::raw('SUM(transactions.amount) as value'))
            ->where('transactions.type', 'debit')
            ->whereMonth('transactions.date', $currentMonth)
            ->whereYear('transactions.date', $currentYear);

        if (!$isAdmin) {
            $query->where('user_wallets.user_id', $userId);
        }

        $rawExpenses = $query->groupBy('transactions.description')
            ->orderByDesc('value')
            ->get();

        $normalizedExpenses = $rawExpenses->map(function ($category) {
            $name = $category->name;
            if (!empty($name)) {
                if (stripos($name, 'makan') !== false || stripos($name, 'food') !== false) {
                    $name = 'Hiburan';
                } elseif (stripos($name, 'transport') !== false) {
                    $name = 'Transportasi';
                } elseif (stripos($name, 'belanja') !== false || stripos($name, 'shopping') !== false) {
                    $name = 'Belanja';
                } elseif (stripos($name, 'listrik') !== false || stripos($name, 'electric') !== false) {
                    $name = 'Tagihan';
                } else {
                    $name = ucwords(strtolower($name));
                }
            } else {
                $name = 'Lainnya';
            }
            return (object)['name' => $name, 'value' => $category->value];
        });

        $groupedExpenses = $normalizedExpenses
            ->groupBy('name')
            ->map(function ($group, $name) {
                return (object)[
                    'name' => $name,
                    'value' => $group->sum('value')
                ];
            })
            ->sortByDesc('value')
            ->values();

        $topExpenses = $groupedExpenses->take(5);
        $otherExpenses = $groupedExpenses->slice(5);

        if ($otherExpenses->isNotEmpty()) {
            $othersSum = $otherExpenses->sum('value');
            $topExpenses->push((object)[
                'name' => 'Lainnya',
                'value' => $othersSum
            ]);
        }

        $totalExpense = $topExpenses->sum('value');
        $colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

        $finalExpenses = $topExpenses->map(function ($category, $index) use ($colors, $totalExpense) {
            return [
                'name' => $category->name,
                'value' => $category->value,
                'color' => $colors[$index % count($colors)],
                'percentage' => $totalExpense > 0 ? round(($category->value / $totalExpense) * 100) : 0
            ];
        });

        return ['data' => $finalExpenses, 'total' => $totalExpense];
    }

    private function prepareWalletBalanceData($userId, $isAdmin)
    {
        $query = DB::table('user_wallets')
            ->join('wallets', 'user_wallets.wallet_id', '=', 'wallets.id')
            ->select(
                'wallets.name as name',
                'user_wallets.balance as value',
            );

        if (!$isAdmin) {
            $query->where('user_wallets.user_id', $userId);
        } else {
            $query->select(
                'wallets.name as name',
                DB::raw('SUM(user_wallets.balance) as value'),
            )->groupBy('wallets.name');
        }

        $walletBalances = $query->orderByDesc('value')->get();

        $colorMap = ['bank' => '#3b82f6', 'cash' => '#10b981', 'e-wallet' => '#8b5cf6', 'credit' => '#ef4444', 'debit' => '#f59e0b', 'investment' => '#0d9488', 'savings' => '#2dd4bf'];
        $defaultColor = '#64748b';
        $totalBalance = $walletBalances->sum('value');

        $walletBalances = $walletBalances->map(function ($wallet) use ($colorMap, $defaultColor, $totalBalance) {
            $type = strtolower($wallet->type ?? '');
            $color = $colorMap[$type] ?? $defaultColor;
            $percentage = $totalBalance > 0 ? round(($wallet->value / $totalBalance) * 100, 1) : 0;

            return ['name' => $wallet->name, 'value' => $wallet->value, 'color' => $color, 'percentage' => $percentage];
        });

        return ['data' => $walletBalances, 'total' => $totalBalance];
    }
}

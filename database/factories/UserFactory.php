<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
    /**
     * Indicate that the model is a lead.
     */
    public function lead(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Lead ' . fake()->name(),
                'email' => 'lead_' . fake()->unique()->userName() . '@example.com',
                'phone' => '+1' . fake()->numerify('##########'),
            ];
        });
    }
    public function customer(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Customer ' . fake()->name(),
                'email' => 'customer_' . fake()->unique()->userName() . '@example.com',
                'phone' => '+1' . fake()->numerify('##########'),
            ];
        });
    }

    /**
     * Configure the model as a sales representative.
     */
    public function sales(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Sales ' . fake()->name(),
                'email' => 'sales_' . fake()->unique()->userName() . '@example.com',
                'phone' => '+1' . fake()->numerify('##########'),
            ];
        });
    }

    /**
     * Configure the model as a manager.
     */
    public function manager(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Manager ' . fake()->name(),
                'email' => 'manager_' . fake()->unique()->userName() . '@example.com',
                'phone' => '+1' . fake()->numerify('##########'),
            ];
        });
    }
}

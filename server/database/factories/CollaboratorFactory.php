<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Collaborator>
 */
class CollaboratorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'matricula' => fake()->numerify('#####'),
            'cpf' => fake()->numerify('###########'),
            'timescale_id' => fake()->numberBetween(1,3),
            'user_id' => function () {
                return User::factory()->create()->id;
            },
        ];
    }
}

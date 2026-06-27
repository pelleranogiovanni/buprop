<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactRequest>
 */
class ContactRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'requester_id' => User::role('tenant')->inRandomOrder()->first()?->id ?? User::factory()->create(),
            'message' => $this->generateMessage(),
            'status' => fake()->randomElement(['sent', 'read', 'closed']),
        ];
    }

    private function generateMessage(): string
    {
        $messages = [
            'Hola, me interesa mucho esta propiedad. ¿Podríamos coordinar una visita?',
            'Buenos días, quisiera más información sobre esta propiedad. ¿Está disponible?',
            '¡Hola! Me encanta esta propiedad. ¿Podemos hablar sobre las condiciones?',
            'Me interesa alquilar esta propiedad. ¿Cuáles son los requisitos?',
            'Hola, estoy buscando exactamente algo así. ¿Podemos coordinar una visita?',
            'Buenos días, me gustaría conocer más detalles sobre esta propiedad.',
            'Hola, ¿la propiedad sigue disponible? Me interesa mucho.',
            'Me interesa esta propiedad para mi familia. ¿Podríamos verla?',
        ];

        $baseMessage = fake()->randomElement($messages);
        
        // Sometimes add additional context
        if (fake()->boolean(30)) {
            $additionalInfo = [
                ' Somos una familia de 3 personas.',
                ' Tengo ingresos demostrables.',
                ' Busco para mudarme el mes que viene.',
                ' ¿Incluye expensas?',
                ' ¿Se pueden tener mascotas?',
            ];
            $baseMessage .= fake()->randomElement($additionalInfo);
        }

        return $baseMessage;
    }

    public function forListing(Listing $listing): static
    {
        return $this->state(fn (array $attributes) => [
            'listing_id' => $listing->listing_id,
        ]);
    }

    public function fromUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'requester_id' => $user->id,
        ]);
    }
}
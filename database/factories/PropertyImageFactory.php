<?php

namespace Database\Factories;

use App\Models\PropertyImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyImageFactory extends Factory
{
    protected $model = PropertyImage::class;

    private static array $pools = [
        'house' => [
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
            'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&q=80',
            'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        ],
        'apartment' => [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
        ],
        'commercial' => [
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
            'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&q=80',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        ],
    ];

    public function definition(): array
    {
        $allUrls = array_merge(...array_values(self::$pools));
        return [
            'url'        => fake()->randomElement($allUrls),
            'sort_order' => 1,
            'is_cover'   => false,
        ];
    }

    public function forPropertyType(string $type): static
    {
        $pool = self::$pools[$type] ?? self::$pools['house'];
        return $this->state(fn () => ['url' => fake()->randomElement($pool)]);
    }

    public function cover(): static
    {
        return $this->state(['is_cover' => true]);
    }

    public static function randomUrlsFor(string $type, int $count = 2): array
    {
        $pool = self::$pools[$type] ?? self::$pools['house'];
        $keys = (array) array_rand($pool, min($count, count($pool)));
        return array_map(fn ($k) => $pool[$k], $keys);
    }
}

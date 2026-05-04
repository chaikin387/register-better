import type { CategorySeed } from '@/types/seed-types'

export const categoriesData: CategorySeed[] = [
  {
    slug: 'zamki',
    name: 'Замки',
    icon: 'Lock',
    sortOrder: 0,
    children: [
      {
        slug: 'zamki-vhodnye',
        name: 'Входные замки',
        sortOrder: 0,
        children: [
          {
            slug: 'vhodnye-vreznye',
            name: 'Врезные',
            sortOrder: 0,
            children: [
              {
                slug: 'vhodnye-vreznye-cilindrovye',
                name: 'Цилиндровые',
                sortOrder: 0,
              },
              {
                slug: 'vhodnye-vreznye-suvaldnye',
                name: 'Сувальдные',
                sortOrder: 1,
              },
              {
                slug: 'vhodnye-vreznye-elektronnye',
                name: 'Электронные / Смарт',
                sortOrder: 2,
              },
              {
                slug: 'vhodnye-vreznye-biometrika',
                name: 'Биометрические',
                sortOrder: 3,
              },
            ],
          },
          {
            slug: 'vhodnye-nakladnye',
            name: 'Накладные',
            sortOrder: 1,
            children: [
              {
                slug: 'vhodnye-nakladnye-cilindrovye',
                name: 'Цилиндровые',
                sortOrder: 0,
              },
              {
                slug: 'vhodnye-nakladnye-suvaldnye',
                name: 'Сувальдные',
                sortOrder: 1,
              },
              {
                slug: 'vhodnye-nakladnye-elektronnye',
                name: 'Электронные',
                sortOrder: 2,
              },
            ],
          },
        ],
      },
      {
        slug: 'zamki-mezhkomnatnye',
        name: 'Межкомнатные замки',
        sortOrder: 1,
        children: [
          { slug: 'mezhk-vreznye', name: 'Врезные', sortOrder: 0 },
          { slug: 'mezhk-nakladnye', name: 'Накладные', sortOrder: 1 },
          {
            slug: 'mezhk-razdvizhnye',
            name: 'Для раздвижных дверей',
            sortOrder: 2,
          },
        ],
      },
      {
        slug: 'zamki-navesnye',
        name: 'Навесные замки',
        sortOrder: 2,
        children: [
          {
            slug: 'navesnye-malenkie',
            name: 'Маленькие',
            sortOrder: 0,
          },
          {
            slug: 'navesnye-srednie',
            name: 'Средние',
            sortOrder: 1,
          },
          {
            slug: 'navesnye-usilennye',
            name: 'Усиленные',
            sortOrder: 2,
          },
          {
            slug: 'navesnye-kodovye',
            name: 'С кодовым механизмом',
            sortOrder: 3,
          },
          {
            slug: 'navesnye-zashita',
            name: 'Защищённые',
            sortOrder: 4,
          },
        ],
      },
      {
        slug: 'zamki-umnye',
        name: 'Умные замки',
        sortOrder: 3,
        children: [
          {
            slug: 'umnye-bluetooth',
            name: 'С Bluetooth',
            sortOrder: 0,
          },
          {
            slug: 'umnye-wifi',
            name: 'С WiFi',
            sortOrder: 1,
          },
          {
            slug: 'umnye-biometrika',
            name: 'Биометрические',
            sortOrder: 2,
          },
          { slug: 'umnye-karta', name: 'С картой / брелоком', sortOrder: 3 },
          {
            slug: 'umnye-komplekt',
            name: 'Комплекты для умного дома',
            sortOrder: 4,
          },
        ],
      },
    ],
  },
  {
    slug: 'furnitura',
    name: 'Фурнитура',
    icon: 'Wrench',
    sortOrder: 1,
    children: [
      {
        slug: 'furnitura-ruchki',
        name: 'Дверные ручки',
        sortOrder: 0,
        children: [
          { slug: 'ruchki-nazhmye', name: 'Нажимные', sortOrder: 0 },
          { slug: 'ruchki-povorotnye', name: 'Поворотные', sortOrder: 1 },
          { slug: 'ruchki-skoby', name: 'Скобы', sortOrder: 2 },
        ],
      },
      {
        slug: 'furnitura-bronenakladki',
        name: 'Броненакладки',
        sortOrder: 1,
        children: [
          { slug: 'brone-vreznye', name: 'Для врезных замков', sortOrder: 0 },
          {
            slug: 'brone-nakladnye',
            name: 'Для накладных замков',
            sortOrder: 1,
          },
        ],
      },
      {
        slug: 'furnitura-dovodchiki',
        name: 'Доводчики и петли',
        sortOrder: 2,
        children: [
          { slug: 'dov-dovodchiki', name: 'Дверные доводчики', sortOrder: 0 },
          { slug: 'dov-petli-skrytye', name: 'Скрытые петли', sortOrder: 1 },
          { slug: 'dov-petli', name: 'Обычные петли', sortOrder: 2 },
        ],
      },
    ],
  },
]

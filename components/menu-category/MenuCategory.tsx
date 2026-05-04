// 'use client'

// import { Button } from '@/components/ui/button'
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from '@/components/ui/hover-card'
// import * as Icons from 'lucide-react'
// import { ChevronRight, LayoutGrid, type LucideIcon } from 'lucide-react'
// import Link from 'next/link'
// import { useState } from 'react'
// import { type CategoryTree } from './category-selects'

// function CategoryIcon({ name }: { name: string | null }) {
//   if (!name) return null
//   const Icon = Icons[name as keyof typeof Icons] as LucideIcon | undefined
//   return Icon ? <Icon className='size-4 shrink-0' /> : null
// }

// type SubItemProps = {
//   item: CategoryTree['children'][number]['children'][number]
//   href: string
// }

// function SubItem({ item, href }: SubItemProps) {
//   const hasChildren = item.children.length > 0

//   if (!hasChildren) {
//     return (
//       <Button
//         asChild
//         variant='link'
//         size='xs'
//         className='h-7 justify-start px-0 text-sm text-muted-foreground hover:text-foreground hover:no-underline'
//       >
//         <Link href={href}>{item.name}</Link>
//       </Button>
//     )
//   }

//   return (
//     <HoverCard
//       openDelay={150}
//       closeDelay={100}
//     >
//       <HoverCardTrigger asChild>
//         <Button
//           asChild
//           variant='link'
//           size='xs'
//           className='h-7 justify-start gap-1 px-0 text-sm text-muted-foreground hover:text-foreground hover:no-underline'
//         >
//           <Link href={href}>
//             {item.name}
//             <ChevronRight className='size-3 shrink-0' />
//           </Link>
//         </Button>
//       </HoverCardTrigger>
//       <HoverCardContent
//         side='bottom'
//         align='start'
//         sideOffset={4}
//         avoidCollisions
//         collisionPadding={16}
//         className='w-52 p-2'
//       >
//         {item.children.map((child) => (
//           <Button
//             asChild
//             key={child.id}
//             variant='ghost'
//             size='xs'
//             className='flex h-8 w-full justify-start text-sm text-muted-foreground hover:text-foreground'
//           >
//             <Link href={`${href}/${child.slug}`}>{child.name}</Link>
//           </Button>
//         ))}
//       </HoverCardContent>
//     </HoverCard>
//   )
// }

// export function MenuCategory({ categories }: { categories: CategoryTree[] }) {
//   const [open, setOpen] = useState(false)
//   const [activeId, setActiveId] = useState(categories[0]?.id ?? 0)

//   const active = categories.find((c) => c.id === activeId) ?? categories[0]

//   return (
//     <>
//       <Button
//         variant='secondary'
//         size='lg'
//         onClick={() => setOpen((v) => !v)}
//       >
//         <LayoutGrid className='size-5' />
//         Каталог
//       </Button>

//       {open && (
//         <>
//           {/* Клик вне — закрыть */}
//           <div
//             className='fixed inset-0 z-40'
//             onClick={() => setOpen(false)}
//           />

//           {/* Панель — absolute на хедере (хедер уже relative), растягивается до низа экрана */}
//           <div className='fixed inset-x-0 top-[65px] bottom-0 z-50 flex border-t bg-background shadow-lg'>
//             <div className='mx-auto flex w-full max-w-360 px-4'>
//               {/* Левая колонка */}
//               <nav className='flex w-64 shrink-0 flex-col border-r py-6 pr-6'>
//                 {categories.map((cat) => (
//                   <Button
//                     asChild
//                     key={cat.id}
//                     variant={activeId === cat.id ? 'secondary' : 'ghost'}
//                     className='h-10 justify-start gap-2 text-base'
//                     onMouseEnter={() => setActiveId(cat.id)}
//                   >
//                     <Link href={`/catalog/${cat.slug}`}>
//                       <CategoryIcon name={cat.icon} />
//                       <span>{cat.name}</span>
//                     </Link>
//                   </Button>
//                 ))}
//               </nav>

//               {/* Правая часть */}
//               <div className='grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(200px,1fr))] content-start gap-x-8 gap-y-6 overflow-y-auto p-6'>
//                 {active?.children.map((group) => (
//                   <div
//                     key={group.id}
//                     className='flex flex-col'
//                   >
//                     <Button
//                       asChild
//                       variant='link'
//                       size='xs'
//                       className='mb-1 h-auto justify-start text-sm font-semibold text-foreground hover:text-muted-foreground hover:no-underline'
//                     >
//                       <Link href={`/catalog/${active.slug}/${group.slug}`}>
//                         {group.name}
//                       </Link>
//                     </Button>

//                     <nav className='flex flex-col'>
//                       {group.children.map((item) => (
//                         <SubItem
//                           key={item.id}
//                           item={item}
//                           href={`/catalog/${active.slug}/${group.slug}/${item.slug}`}
//                         />
//                       ))}
//                     </nav>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   )
// }

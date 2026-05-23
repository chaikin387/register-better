// 'use client'

// import { Button } from '@/components/ui/button'
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet'
// import { Session } from '@/lib/auth'
// import { CategoryTree } from '@/types/category-selects'
// import { Menu, ShoppingBag } from 'lucide-react'
// import Link from 'next/link'
// import { useState } from 'react'
// import { CatalogMenu } from '../sheet-catalog/CatalogMenu'
// import { ModeToggle } from './ModeToggle'
// import { UserMenu } from './UserMenu'
// import { useNavigate } from './use-navigate'

// interface Props {
//   session: Session | null
//   categories: CategoryTree[]
// }

// export const HeaderClient = ({ session, categories }: Props) => {
//   const [open, setOpen] = useState(false)
//   const { navigate, isPending } = useNavigate(() => setOpen(false))

//   return (
//     <>
//       <div className='bg-background'>
//         <div className='container mx-auto flex h-8 items-center p-4 text-sm text-muted-foreground'>
//           Санкт-Петербург
//         </div>
//       </div>

//       <header className='sticky top-0 z-50 border-b bg-background'>
//         <div className='container mx-auto flex h-16 items-center justify-between gap-6 px-4'>
//           <div className='flex items-center gap-2'>
//             <Link
//               href='/'
//               onClick={navigate('/')}
//               className='flex items-baseline gap-2'
//               data-outside-sheet
//             >
//               <ShoppingBag />
//             </Link>

//             <Sheet
//               open={open}
//               onOpenChange={setOpen}
//               modal={false}
//             >
//               <SheetTrigger asChild>
//                 <Button className=''>
//                   <Menu />
//                   Каталог
//                 </Button>
//               </SheetTrigger>

//               <SheetContent
//                 side='bottom'
//                 showCloseButton={false}
//                 onInteractOutside={(e) => {
//                   const target = e.target as HTMLElement
//                   if (target.closest('[data-outside-sheet]')) e.preventDefault()
//                 }}
//                 className='fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t bg-indigo-300'
//               >
//                 <SheetHeader className='sr-only'>
//                   <SheetTitle>Каталог</SheetTitle>
//                   <SheetDescription>Выберите категорию</SheetDescription>
//                 </SheetHeader>
//                 <div className='container mx-auto px-4 py-8'>
//                   <CatalogMenu
//                     categories={categories}
//                     navigate={navigate}
//                   />
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>

//           <div className='flex items-center gap-2'>
//             <ModeToggle />
//             <UserMenu
//               session={session}
//               navigate={navigate}
//             />
//           </div>
//         </div>

//         {isPending && (
//           <div className='fixed inset-x-0 top-16 bottom-0 z-1001 border-t bg-red-300' />
//         )}
//       </header>
//     </>
//   )
// }

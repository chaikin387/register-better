// 'use client'

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { AdminAttributeValueSelectItem } from '@/types/admin-attribute-value.selects'

// interface Props {
//   values: Pick<AdminAttributeValueSelectItem, 'id' | 'value'>[]
//   value?: string | null
//   onChange: (id: string | null) => void
//   disabled?: boolean
//   placeholder?: string
// }

// export function AdminAttributeValueSelect({
//   values,
//   value,
//   onChange,
//   disabled,
//   placeholder = 'Выберите значение',
// }: Props) {
//   return (
//     <Select
//       value={value ?? ''}
//       onValueChange={onChange}
//       disabled={disabled}
//     >
//       <SelectTrigger>
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         {values.map((item) => (
//           <SelectItem
//             key={item.id}
//             value={item.id}
//           >
//             {item.value}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// }

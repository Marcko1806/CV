import { Badge } from '../ui/Badge'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants'

export function TaskStatusBadge({ status }) {
  return (
    <Badge color={STATUS_COLORS[status] ?? 'gray'}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}

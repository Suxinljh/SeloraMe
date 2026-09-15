import { Image } from '@tarojs/components'
import type { ImageProps } from '@tarojs/components'
import arrowBack from '@material-design-icons/svg/round/arrow_back.svg'
import arrowForward from '@material-design-icons/svg/round/arrow_forward.svg'
import search from '@material-design-icons/svg/round/search.svg'
import check from '@material-design-icons/svg/round/check.svg'
import chevronRight from '@material-design-icons/svg/round/chevron_right.svg'
import home from '@material-design-icons/svg/round/home.svg'
import gridView from '@material-design-icons/svg/round/grid_view.svg'
import accountCircle from '@material-design-icons/svg/round/account_circle.svg'
import psychology from '@material-design-icons/svg/round/psychology.svg'
import sentimentSatisfied from '@material-design-icons/svg/round/sentiment_satisfied.svg'
import favorite from '@material-design-icons/svg/round/favorite.svg'
import groups from '@material-design-icons/svg/round/groups.svg'
import businessCenter from '@material-design-icons/svg/round/business_center.svg'
import explore from '@material-design-icons/svg/round/explore.svg'
import spa from '@material-design-icons/svg/round/spa.svg'
import palette from '@material-design-icons/svg/round/palette.svg'
import autoAwesome from '@material-design-icons/svg/round/auto_awesome.svg'
import badge from '@material-design-icons/svg/round/badge.svg'
import helpOutline from '@material-design-icons/svg/round/help_outline.svg'
import quiz from '@material-design-icons/svg/round/quiz.svg'
import inventory from '@material-design-icons/svg/round/inventory_2.svg'
import assessment from '@material-design-icons/svg/round/assessment.svg'
import receipt from '@material-design-icons/svg/round/receipt_long.svg'
import bookmark from '@material-design-icons/svg/round/bookmark.svg'
import calendar from '@material-design-icons/svg/round/calendar_month.svg'
import settings from '@material-design-icons/svg/round/settings.svg'
import replay from '@material-design-icons/svg/round/replay.svg'
import share from '@material-design-icons/svg/round/share.svg'
import download from '@material-design-icons/svg/round/file_download.svg'
import schedule from '@material-design-icons/svg/round/schedule.svg'
import logout from '@material-design-icons/svg/round/logout.svg'
import receiptOutlined from '@material-design-icons/svg/outlined/receipt_long.svg'
import bookmarkOutlined from '@material-design-icons/svg/outlined/bookmark_border.svg'
import calendarOutlined from '@material-design-icons/svg/outlined/calendar_month.svg'
import helpOutlineOutlined from '@material-design-icons/svg/outlined/help_outline.svg'
import settingsOutlined from '@material-design-icons/svg/outlined/settings.svg'
import psychologyOutlined from '@material-design-icons/svg/outlined/psychology.svg'

const icons = { arrowBack, arrowForward, search, check, chevronRight, home, gridView, accountCircle, psychology, sentimentSatisfied, favorite, groups, businessCenter, explore, spa, palette, autoAwesome, badge, helpOutline, quiz, inventory, assessment, receipt, bookmark, calendar, settings, replay, share, download, schedule, logout }
const outlinedIcons = { receipt: receiptOutlined, bookmark: bookmarkOutlined, calendar: calendarOutlined, helpOutline: helpOutlineOutlined, settings: settingsOutlined, psychology: psychologyOutlined }
export type IconName = keyof typeof icons
export type IconVariant = 'round' | 'outlined'
export default function Icon ({ name, variant = 'round', className = '', ...props }: { name: IconName; variant?: IconVariant; className?: string } & Omit<ImageProps, 'src' | 'mode'>) {
  const source = variant === 'outlined' && name in outlinedIcons
    ? outlinedIcons[name as keyof typeof outlinedIcons]
    : icons[name]

  return <Image className={`material-icon ${className}`} src={source} mode='aspectFit' {...props} />
}

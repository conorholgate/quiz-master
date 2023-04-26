export interface TimerProps {
  time: number
  label: string
  timeExpiredMessage: string
}

export interface EmitFunctions {
  timeFinished: () => void
}

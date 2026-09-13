import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from "lucide-react"
import { cn } from "cn"

// Global manager so `toast.success(...)` can be called from anywhere
// (hooks, slices, pages) without needing to read the toast context.
const toastManager = ToastPrimitive.createToastManager()

type ToastOptions = {
  title?: string
  description?: string
}

function add(type: "success" | "error" | "info", input: string | ToastOptions) {
  const options = typeof input === "string" ? { description: input } : input

  return toastManager.add({ type, timeout: 4000, ...options })
}

export const toast = {
  success: (input: string | ToastOptions) => add("success", input),
  error: (input: string | ToastOptions) => add("error", input),
  info: (input: string | ToastOptions) => add("info", input),
}

const typeIcons = {
  success: <CheckCircle2Icon className="size-4.5 text-emerald-600 dark:text-emerald-400" />,
  error: <XCircleIcon className="size-4.5 text-destructive" />,
  info: <InfoIcon className="size-4.5 text-primary" />,
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((item) => (
    <ToastPrimitive.Root
      key={item.id}
      toast={item}
      className={cn(
        "[--gap:0.6rem] [--peek:0.6rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] w-full origin-bottom",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
        "h-(--height) rounded-lg border bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10 select-none",
        "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
        "data-starting-style:[transform:translateY(150%)] data-ending-style:opacity-0",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-limited:opacity-0",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
      )}
    >
      <ToastPrimitive.Content className="flex items-start gap-3 overflow-hidden p-3.5 pr-2 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100">
        {typeIcons[(item.type as keyof typeof typeIcons) ?? "info"]}

        <div className="min-w-0 flex-1 space-y-0.5 pt-0.5">
          {item.title && (
            <ToastPrimitive.Title className="text-sm font-medium" />
          )}
          <ToastPrimitive.Description className="text-sm text-muted-foreground" />
        </div>

        <ToastPrimitive.Close
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <XIcon className="size-3.5" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Content>
    </ToastPrimitive.Root>
  ))
}

function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} timeout={4000}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-50 mx-auto flex w-[calc(100vw-2rem)] max-w-96 flex-col sm:right-6 sm:bottom-6">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}

export { Toaster }

// 토스트 알림 컴포넌트

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return <div role="alert">{message}</div>;
}

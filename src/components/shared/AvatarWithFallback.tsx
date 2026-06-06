import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarWithFallbackProps {
  src?: string;
  name: string;
  className?: string;
}

export default function AvatarWithFallback({ src, name, className }: AvatarWithFallbackProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback>{name[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

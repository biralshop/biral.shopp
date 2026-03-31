import { Truck, CreditCard, Headphones } from 'lucide-react';

const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-primary-foreground text-xs py-2 w-full overflow-hidden">
      <div className="container mx-auto flex items-center justify-center gap-6 md:gap-10 flex-wrap px-4">
        <span className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" />
          50₼+ sifarişlərə pulsuz çatdırılma
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          Təhlükəsiz ödəniş
        </span>
        <span className="hidden md:flex items-center gap-1.5">
          <Headphones className="h-3.5 w-3.5" />
          7/24 dəstək
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;

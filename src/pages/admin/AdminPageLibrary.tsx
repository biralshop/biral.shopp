import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

const filterTabs = ['Hamısı', 'Storefront', 'Checkout', 'Hesab bölməsi', 'Dəstək'];

const pages = [
  { name: 'Ana səhifə', desc: 'Hero, kateqoriya, viral shelf', status: 'Aktiv' },
  { name: 'Kateqoriyalar', desc: 'Kateqoriya hub + alt bloklar', status: 'Aktiv' },
  { name: 'Məhsul listing', desc: 'Filter sidebar və sortlama', status: 'Aktiv' },
  { name: 'Məhsul detalları', desc: 'Gallery, review, related', status: 'Aktiv' },
  { name: 'Səbət', desc: 'Upsell və səbət xülasəsi', status: 'Aktiv' },
  { name: 'Checkout', desc: 'Ödəniş və çatdırılma addımları', status: 'Aktiv' },
  { name: 'Hesab profil', desc: 'Profil, sifarişlər, seçilənlər', status: 'Aktiv' },
  { name: 'Hardadır? tracking', desc: 'Sifariş izləmə timeline', status: 'Aktiv' },
  { name: 'Dəstək', desc: 'FAQ, ticket, canlı çat', status: 'Aktiv' },
];

const AdminPageLibrary = () => (
  <AdminLayout>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Storefront səhifə kitabxanası</h1>
        <p className="text-sm text-muted-foreground">Bütün front-end səhifələri, hesab bölmələri və checkout addımları</p>
      </div>
      <Button className="bg-primary text-sm">Yeni landing səhifə</Button>
    </div>

    <div className="flex items-center gap-2 mb-6">
      {filterTabs.map((t, i) => (
        <Button key={t} size="sm" variant={i === 0 ? 'default' : 'outline'} className="text-xs h-8">{t}</Button>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-6">
      {pages.map((page) => (
        <div key={page.name} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted h-40 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">{page.name} preview</p>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-sm">{page.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{page.desc}</p>
            <div className="flex items-center justify-between mt-3">
              <Badge className="bg-green-100 text-green-700 border-0 text-xs">{page.status}</Badge>
              <Button size="sm" variant="ghost" className="text-xs text-primary h-7">Redaktə et</Button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <p className="text-sm text-muted-foreground text-center mt-8">
      Bu kitabxanadan banner, mətn, button, menyu, footer, hesab bölməsi, checkout addımları və dəstək məzmunu ayrıca idarə olunur.
    </p>
  </AdminLayout>
);

export default AdminPageLibrary;

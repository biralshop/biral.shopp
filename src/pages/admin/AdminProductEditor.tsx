import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImagePlus, Package, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { productsAPI, adminAPI } from '@/lib/api';

const AdminProductEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'yeni';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    categorySlug: '',
    description: '',
    price: 0,
    oldPrice: 0,
    rating: 5,
    stock: 0,
    images: [] as string[],
    badge: ''
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      productsAPI.getById(id)
        .then((res) => {
          setFormData({
            title: res.product.title || '',
            category: res.product.category || '',
            categorySlug: res.product.categorySlug || '',
            description: res.product.description || '',
            price: res.product.price || 0,
            oldPrice: res.product.oldPrice || 0,
            rating: res.product.rating || 5,
            stock: res.product.stock || 0,
            images: res.product.images || [],
            badge: res.product.badge || ''
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'oldPrice' || name === 'stock' || name === 'rating' ? Number(value) : value 
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await adminAPI.uploadImage(file);
      setFormData(prev => ({ ...prev, images: [...prev.images, res.url] }));
    } catch (err) {
      alert((err as Error).message || 'Şəkil yüklənərkən xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Generate slug if empty
      const payload = {
        ...formData,
        categorySlug: formData.categorySlug || formData.category.toLowerCase().replace(/[^a-z0-9]/g, '-')
      };

      if (isNew) {
        await adminAPI.createProduct(payload);
        alert('Məhsul uğurla yaradıldı!');
        navigate('/admin/mehsullar');
      } else {
        await adminAPI.updateProduct(id as string, payload);
        alert('Məhsul uğurla yeniləndi!');
      }
    } catch (err) {
      alert((err as Error).message || 'Server xətası');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) return;
    try {
      setSaving(true);
      await adminAPI.deleteProduct(id as string);
      navigate('/admin/mehsullar');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-8 text-center">Yüklənir...</div></AdminLayout>;

  return (
  <AdminLayout>
    <div className="mb-6 flex items-center gap-3">
      <Button variant="ghost" size="icon" onClick={() => navigate('/admin/mehsullar')}><ArrowLeft className="h-5 w-5" /></Button>
      <div>
        <h1 className="text-2xl font-bold">{isNew ? 'Yeni Məhsul Əlavə Et' : 'Məhsul Redaktəsi'}</h1>
        <p className="text-sm text-muted-foreground">Məhsulun bütün məlumatlarını buradan idarə edin</p>
      </div>
    </div>

    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">{formData.title || 'Adsız məhsul'}</h2>
      <Badge className={`${formData.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-0`}>
        {formData.stock > 0 ? 'Aktiv' : 'Tükənib'}
      </Badge>
      <div className="flex-1" />
      {!isNew && (
        <Button size="sm" variant="outline" onClick={handleDelete} className="text-xs text-red-500 border-red-200" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Məhsulu Sil'}
        </Button>
      )}
      <Button size="sm" className="bg-primary text-xs w-32" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yadda Saxla'}
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Main form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-4">Əsas məlumatlar</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Məhsul adı</Label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="Məhsulun tam adı" />
            </div>
            <div>
              <Label className="text-xs">Qısa təsvir</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Məhsul haqqında qısa məlumat..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Kateqoriya (Görünən Ad)</Label>
                <Input name="category" value={formData.category} onChange={handleChange} placeholder="Məs: Mətbəx" />
              </div>
              <div>
                <Label className="text-xs">Kateqoriya Slug (Link üçün - istəyə bağlı)</Label>
                <Input name="categorySlug" value={formData.categorySlug} onChange={handleChange} placeholder="Məs: metbex" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-xs">Qiymət (AZN)</Label><Input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} /></div>
              <div><Label className="text-xs">Köhnə Qiymət (AZN)</Label><Input type="number" step="0.01" name="oldPrice" value={formData.oldPrice} onChange={handleChange} /></div>
              <div><Label className="text-xs">Stok Miqdarı</Label><Input type="number" name="stock" value={formData.stock} onChange={handleChange} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-4">Məhsul Şəkilləri</h3>
          <p className="text-xs text-muted-foreground mb-4">Şəkilləri birbaşa kompüterinizdən yükləyə və ya URL kopyalayaraq əlavə edə bilərsiniz.</p>
          
          <div className="flex gap-2 mb-4">
            <Input 
              value={imageUrlInput} 
              onChange={e => setImageUrlInput(e.target.value)} 
              placeholder="Şəkil URL-i (Nümunə: https://picsum.photos/...)" 
              className="text-sm"
              onKeyDown={e => e.key === 'Enter' && handleAddImageUrl()}
            />
            <Button type="button" onClick={handleAddImageUrl} variant="secondary">URL Əlavə Et</Button>
          </div>

          <div className="flex items-center justify-center bg-muted/30 rounded-lg p-6 border-2 border-dashed border-border/60">
            <Label className="cursor-pointer text-center">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              <div className="flex flex-col items-center gap-2">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-primary">Kompüterdən şəkil yüklə</span>
                  </>
                )}
              </div>
            </Label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group rounded-md overflow-hidden aspect-square border">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {idx === 0 && <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-bold">ƏSAS</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Kart preview & parametrlər</h3>
          <p className="text-xs text-muted-foreground mb-3">Məhsul sayt üzərində necə görünür</p>
          <div className="bg-muted rounded-lg h-36 flex items-center justify-center overflow-hidden">
            {formData.images.length > 0 ? (
              <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Package className="h-8 w-8 text-muted-foreground mx-auto" />
            )}
          </div>
          <p className="text-sm font-semibold mt-3 line-clamp-2">{formData.title || 'Adsız məhsul'}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-bold text-primary">AZN {formData.price.toFixed(2)}</p>
            {formData.oldPrice > formData.price && (
              <span className="text-xs text-muted-foreground line-through">AZN {formData.oldPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-5 pt-5 border-t border-border">
             <Label className="text-xs mb-2 block">Xüsusi Nişan (Badge)</Label>
             <Input name="badge" value={formData.badge} onChange={handleChange} placeholder="Məs: ENDİRİM, YENİ" className="text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-xs">Reytinq (1-5)</Label>
              <Input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminProductEditor;

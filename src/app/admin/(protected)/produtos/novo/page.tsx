'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { uploadImage, createProduct, getProducts } from '@/lib/api';

export default function AddProductAdmin() {
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [existingCategories, setExistingCategories] = useState<string[]>(['Acessórios', 'Vestuário', 'Moda Praia']);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    category: 'Acessórios',
    tag: '',
    description: '',
  });

  useEffect(() => {
    getProducts().then(products => {
      const categories = Array.from(new Set(products.map(p => p.category)));
      if (categories.length > 0) {
        setExistingCategories(prev => Array.from(new Set([...prev, ...categories])));
      }
    }).catch(console.error);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const autoSlug = value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
      setFormData(prev => ({ ...prev, name: value, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = (session as { backendToken?: string })?.backendToken ?? '';

      // 1. Upload the image first
      let imageUrl = '';
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, token);
        imageUrl = uploadResult.url;
      } else {
        setError('Selecione uma imagem para o produto.');
        setIsLoading(false);
        return;
      }

      // 2. Create the product with the uploaded image URL
      await createProduct({
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        image: imageUrl,
        tag: formData.tag || null,
        category: formData.category,
        description: formData.description,
      }, token);

      setIsSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setImagePreview(null);
    setImageFile(null);
    setError('');
    setFormData({ name: '', slug: '', price: '', category: 'Acessórios', tag: '', description: '' });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Adicionar Novo Produto</h1>
        <p className="text-zinc-500 mt-2">Crie listagens perfeitas para as suas novas peças artesanais.</p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-zinc-200 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-4">Produto Publicado!</h2>
          <p className="text-zinc-600 mb-8 max-w-md">O produto foi salvo no banco de dados e já aparece na loja para os clientes.</p>
          <div className="flex gap-4">
            <button onClick={resetForm} className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Adicionar Outro
            </button>
            <Link href="/admin/produtos" className="border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-bold px-8 py-3 rounded-xl transition-colors">
              Ver Produtos
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Image Upload */}
            <div className="lg:col-span-1">
              <label className="text-sm font-bold text-zinc-900 uppercase tracking-widest block mb-4">Imagem do Produto</label>
              <div className="relative aspect-[4/5] w-full border-2 border-dashed border-zinc-300 hover:border-primary bg-zinc-50 rounded-2xl overflow-hidden transition-all group">
                <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-bold text-zinc-700 text-sm">Clique para fazer upload</p>
                    <p className="text-xs text-zinc-400 mt-1">PNG, JPG ou WebP (máx. 50 MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome da Peça</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Bolsa Verão Amarela" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">URL Amigável (Slug)</label>
                  <input type="text" name="slug" value={formData.slug} readOnly className="border border-zinc-200 rounded-xl px-4 py-3 bg-zinc-100 text-zinc-500 cursor-not-allowed font-mono text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Preço (R$)</label>
                  <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} placeholder="Ex: 199.90" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Categoria</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                      placeholder="Escolha ou digite uma nova..."
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-zinc-100 shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto anima-in fade-in slide-in-from-top-2 duration-200">
                        {existingCategories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, category: cat }));
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-primary transition-colors font-medium flex items-center justify-between group"
                          >
                            {cat}
                            {formData.category === cat && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                        <div className="border-t border-zinc-50 mt-2 px-4 py-2">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ou digite uma nova acima</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tag de Destaque (Opcional)</label>
                <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} placeholder="Ex: NOVO, DESTAQUE, PREMIUM" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Descrição do Produto</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} placeholder="Fale sobre os fios usados, medidas, como a peça veste, tempo de fabricação..." rows={6} className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium resize-none" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-sm min-w-[200px] disabled:opacity-60"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : 'Publicar Produto'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

export function useMenu() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const [productPage, settingsPage] = await Promise.all([
        db.entities.Product.filter({ is_active: true }, { sort: 'sort_order', limit: 200 }),
        db.entities.StoreSettings.list({ sort: '-created_date', limit: 1 }),
      ]);
      if (!active) return;
      setProducts(productPage?.items ?? []);
      setSettings(settingsPage?.items?.[0] ?? null);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { products, settings, loading };
}
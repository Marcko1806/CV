# Adrenalina — Tema de Shopify para deportes extremos 🚵🛹🏄⛸️

Tema completo de Shopify (Online Store 2.0) en español, diseñado para una tienda de
**mountain bike, skate, surf, patín** y todo lo relacionado con deportes de acción.

## ¿Qué incluye?

- **Página de inicio** con hero a pantalla completa, 4 categorías destacadas (Mountain Bike,
  Skate, Surf, Patín), ventajas de la tienda, productos más vendidos, bloque de historia
  de marca y newsletter.
- **Página de producto** completa: galería con miniaturas, selector de variantes (talla,
  color…), cantidad, añadir al carrito por AJAX (sin recargar), botones de pago dinámico,
  pestañas desplegables y productos relacionados.
- **Colecciones** con banner, ordenación y paginación. Carrito, búsqueda, blog con
  comentarios, páginas de contenido, formulario de contacto, 404 y página de contraseña.
- **Cuentas de cliente**: login, registro, recuperar contraseña, pedidos y direcciones.
- **Tarjetas de regalo** con su propia plantilla.
- Personalizable desde el editor de temas: colores, tipografías, logo, menús, redes
  sociales y todas las secciones (arrastrar, soltar, añadir y quitar).
- Idiomas: **español (predeterminado)** e inglés.

## Cómo subirlo a Shopify

### Opción A — Subir un ZIP (la más fácil)

1. Crea tu tienda en [shopify.com](https://www.shopify.com) si aún no la tienes.
2. Genera el ZIP del tema (el contenido de esta carpeta debe quedar en la raíz del ZIP):

   ```bash
   cd adrenalina-theme
   zip -r ../adrenalina.zip assets config layout locales sections snippets templates
   ```

3. En el admin de Shopify: **Tienda online → Temas → Añadir tema → Subir archivo ZIP**.
4. Pulsa **Personalizar** para ajustarlo y luego **Publicar**.

### Opción B — Shopify CLI (para desarrollar)

```bash
npm install -g @shopify/cli@latest
cd adrenalina-theme
shopify theme dev --store TU-TIENDA.myshopify.com   # vista previa en vivo
shopify theme push                                   # subirlo a la tienda
```

## Configuración inicial recomendada (10 minutos)

1. **Crea las 4 colecciones** en *Productos → Colecciones*: `Mountain Bike`, `Skate`,
   `Surf` y `Patín` (y las que quieras: cascos, protecciones, ropa, recambios…).
   Ponles una buena imagen destacada: se usa en las tarjetas de la portada.
2. **Asigna las colecciones** en el editor de temas: sección *Lista de colecciones* →
   cada bloque ya tiene el título preparado, solo elige su colección.
3. **Menú principal** (*Tienda online → Navegación → Menú principal*): añade enlaces a las
   4 colecciones. Los submenús se muestran como desplegables automáticamente.
4. **Menú de pie de página** (`Footer menu`): políticas, contacto, sobre nosotros.
5. **Productos destacados**: en la sección de la portada, elige la colección a mostrar
   (puedes crear una colección "Destacados" o "Más vendidos").
6. **Página de contacto**: crea una página en *Tienda online → Páginas* y asígnale la
   plantilla `page.contact`.
7. **Logo, colores y redes sociales**: en el editor → *Configuración del tema*.
   El color de acento por defecto es naranja (#ff4d00); cámbialo al de tu marca.

## Estructura del tema

```
adrenalina-theme/
├── assets/          CSS y JavaScript
├── config/          Ajustes del tema (colores, tipografía, logo, redes…)
├── layout/          Plantilla base (theme.liquid) y página de contraseña
├── locales/         Traducciones (es predeterminado, en)
├── sections/        Secciones reutilizables (hero, header, footer, producto…)
├── snippets/        Fragmentos (tarjeta de producto, precio, iconos…)
└── templates/       Plantillas JSON de cada tipo de página
```

## Ideas para ampliar

- Filtros por talla/marca/precio en colecciones (Search & Discovery + `main-collection`).
- Búsqueda predictiva (Predictive Search API).
- Carrito lateral (drawer) en lugar de página de carrito.
- Secciones extra: vídeo de fondo, Instagram feed, marcas, testimonios.
- Apps recomendadas: Judge.me (reseñas), Klaviyo (email), Search & Discovery (filtros).

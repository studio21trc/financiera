# Grupo Luján Financiera — Guía rápida

## Archivos (súbelos TODOS juntos, en la misma carpeta)
- `prestamos.html` — sitio público + portal del cliente (registro, solicitud, contrato, pagos).
- `admin.html` — panel del administrador.
- `manifest.webmanifest`, `admin.webmanifest`, `sw.js` y la carpeta `img/` — hacen que las páginas
  se puedan **instalar como app** en celular, tablet y computadora.
- `firestore.rules` y `storage.rules` — reglas de seguridad de Firebase. **Obligatorio publicarlas.**
- `respaldo_original/` — versión anterior de las páginas (no la subas al hosting).

## 1. Configurar Firebase (proyecto lujan-financiera)
1. **Authentication → Comenzar → Correo electrónico/contraseña → Habilitar.**
2. **Authentication → Configuración → Dominios autorizados:** agrega el dominio de tu sitio.
3. **Firestore Database → Crear base de datos** (modo producción) → **Reglas**: pega `firestore.rules` → **Publicar**.
4. **Storage → Comenzar** → **Reglas**: pega `storage.rules` → **Publicar**.
5. **Authentication → Usuarios → Agregar usuario**: crea la cuenta del administrador (`jesus.lujanrdz@gmail.com`).

Si cambias el correo del administrador, cámbialo en 3 lugares: `admin.html` (CONFIG), `firestore.rules` y `storage.rules`.
Si cambias montos o plazo en `prestamos.html`, actualiza también `validaNueva()` en `firestore.rules`.

## 2. Configurar datos del negocio
En `prestamos.html`, busca `window.CONFIG_LUJAN` y llena:
- `PAGO`: banco, titular y CLABE/tarjeta donde los clientes depositan cada sábado
  (vacío = el cliente verá un botón para pedirlos por WhatsApp).
- `FACEBOOK_URL` / `INSTAGRAM_URL` (vacíos = se ocultan los íconos).
- Teléfono, correo y ciudad.

## 3. Instalar como app
El sitio debe estar publicado con **https** (Firebase Hosting, Netlify, etc. lo incluyen).
- **Android (Chrome):** menú ⋮ → "Instalar app" / "Agregar a pantalla principal".
- **iPhone (Safari):** botón Compartir → "Agregar a inicio".
- **Computadora (Chrome/Edge):** ícono de instalar en la barra de direcciones.
El cliente instala `prestamos.html` y el administrador instala `admin.html` (cada una es una app separada).

## 4. Textos legales
El Aviso de privacidad, los Términos y el contrato son plantillas. Pide a un abogado que los revise.

## 5. Recomendado
- Authentication → Templates: pon en español el correo de "restablecer contraseña".
- Activa la verificación en dos pasos en la cuenta de Google del administrador.

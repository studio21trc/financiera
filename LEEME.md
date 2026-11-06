# Grupo Luján Financiera — Guía rápida

## Archivos (súbelos TODOS juntos, en la misma carpeta)
- `prestamos.html` — sitio público + portal del cliente (registro, solicitud, firma de documentos, pagos).
- `admin.html` — panel del administrador (solicitudes, pagos, préstamos, **reportes**, **alta de clientes existentes**).
- `legal.js` — **aviso de privacidad, contrato de préstamo de confianza y pagaré** (lo usan las dos páginas).
- `manifest.webmanifest`, `admin.webmanifest`, `sw.js` y la carpeta `img/` — permiten **instalar las páginas como app**.
- `firestore.rules` y `storage.rules` — reglas de seguridad de Firebase. **Obligatorio publicarlas cada vez que cambien.**
- `respaldo_original/` — versión anterior de las páginas (no la subas al hosting).

## 1. Configurar Firebase (proyecto lujan-financiera)
1. **Authentication → Comenzar → Correo electrónico/contraseña → Habilitar.**
2. **Authentication → Configuración → Dominios autorizados:** agrega el dominio de tu sitio.
3. **Firestore Database → Crear base de datos** (modo producción) → **Reglas**: pega `firestore.rules` → **Publicar**.
4. **Storage → Comenzar** → **Reglas**: pega `storage.rules` → **Publicar**.
   - ⚠️ En proyectos nuevos, Firebase pide activar el **plan Blaze** (pago por uso) para usar Storage. Incluye una cuota gratuita amplia;
     con el volumen de fotos de este sistema normalmente no se paga nada, pero se requiere registrar una tarjeta.
   - **Si Storage no está activado o no publicaste `storage.rules`, las fotos no se pueden subir** y la solicitud no se envía.
     Ahora el portal muestra un mensaje claro en ese caso (antes se quedaba cargando).
5. **Authentication → Usuarios → Agregar usuario**: crea la cuenta del administrador (`jesus.lujanrdz@gmail.com`).

Si cambias el correo del administrador, cámbialo en 3 lugares: `admin.html` (CONFIG), `firestore.rules` y `storage.rules`.
Si cambias montos o plazo en `prestamos.html`, actualiza también `validaNueva()` en `firestore.rules`.

## 2. Configurar datos del negocio
En `legal.js`, al inicio (bloque `ACREEDOR`):
- `DOMICILIO`: domicilio completo de Jesús Gerardo Luján Rodríguez (aparece en el contrato y el pagaré). **Llénalo.**
- `MORATORIO_MENSUAL`: interés moratorio mensual (por defecto 3 %).

En `prestamos.html`, busca `window.CONFIG_LUJAN` y llena:
- `PAGO`: banco, titular y CLABE/tarjeta donde los clientes depositan cada sábado (vacío = se piden por WhatsApp).
- `FACEBOOK_URL` / `INSTAGRAM_URL` (vacíos = se ocultan los íconos).
- Montos: de `MONTO_MIN` a `MONTO_MAX` desde la primera solicitud (ya no existe el límite de $5,000 para la primera vez).

## 3. Cómo funciona
**Cliente nuevo (en línea):** se registra → llena sus datos (persona física o empresa) → elige su identificación
(INE: frente y reverso; pasaporte: hoja con foto; etc.), sube comprobante de domicilio y documentación de garantía →
tú apruebas → el cliente lee y firma con su dedo/mouse los 3 documentos → el préstamo queda activo.

**Cliente que ya tenías (alta manual):** Panel → **Clientes existentes** → captura nombre, teléfono, correo, monto, pago,
fecha en que recibió el dinero y **cuántas semanas lleva pagadas**. Se crea su cuenta con una contraseña temporal
(envíasela por el botón de WhatsApp; también recibe un correo para elegir la suya). Al entrar, solo puede subir su
documentación y firmar; su préstamo se activa con el calendario y las semanas que capturaste.

**Ajustar en qué semana va alguien:** en **Reportes** o en **Préstamos activos → Ver detalles**, botón «Semana».

**Reportes:** capital invertido, retorno esperado, ganancia esperada y cobrada, total cobrado, por cobrar,
cartera vencida y avance de cada cliente (en qué semana va y cuántas lleva pagadas). Se puede exportar a Excel (CSV).

## 4. Documentos legales — importante
- Todos los documentos están a nombre de **JESÚS GERARDO LUJÁN RODRÍGUEZ** como acreedor, y del deudor o su empresa.
- Son plantillas profesionales basadas en el Código Civil Federal, el Código de Comercio y la Ley General de Títulos y
  Operaciones de Crédito, pero **deben ser revisadas por un abogado** antes de usarse (tasa de interés, moratorios, jurisdicción).
- La firma en línea queda registrada con fecha, hora y huella digital de los documentos. Aun así, **para cobrar el pagaré
  por la vía ejecutiva se recomienda imprimirlo y que el cliente lo firme de puño y letra**: en el panel, en cada préstamo,
  usa «Ver / imprimir contrato, pagaré y aviso».

## 5. Instalar como app
El sitio debe estar publicado con **https** (Firebase Hosting, Netlify, etc. lo incluyen).
- **Android (Chrome):** menú ⋮ → "Instalar app".  **iPhone (Safari):** Compartir → "Agregar a inicio".
- **Computadora (Chrome/Edge):** ícono de instalar en la barra de direcciones.
El panel de administrador usa una sesión aparte: puedes tener abiertos el portal de cliente y el admin en el mismo navegador.

## 6. Recomendado
- Authentication → Templates: pon en español el correo de "restablecer contraseña" (lo reciben los clientes dados de alta).
- Activa la verificación en dos pasos en la cuenta de Google del administrador.

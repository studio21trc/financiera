# Grupo Luján Financiera — Guía rápida

## Archivos
- `prestamos.html` — sitio público + portal del cliente (registro, solicitud, contrato, pagos).
- `admin.html` — panel del administrador.
- `firestore.rules` y `storage.rules` — reglas de seguridad de Firebase. **Obligatorio publicarlas.**
- `respaldo_original/` — versión anterior de las páginas, por si necesitas regresar.

## 1. Publicar las reglas de seguridad (MUY IMPORTANTE)
Sin estas reglas, cualquier cliente con conocimientos básicos puede marcar sus pagos como
confirmados o su préstamo como liquidado desde el navegador.

1. Entra a https://console.firebase.google.com → proyecto **studio21-88f47**.
2. **Firestore Database → Reglas**: borra lo que haya, pega el contenido de `firestore.rules` y presiona **Publicar**.
3. **Storage → Reglas**: pega el contenido de `storage.rules` y presiona **Publicar**.

Si cambias el correo del administrador, cámbialo en 3 lugares: `admin.html` (CONFIG), `firestore.rules` y `storage.rules`.
Si cambias montos o plazo en `prestamos.html`, actualiza también `validaNueva()` en `firestore.rules`.

## 2. Configurar datos del negocio
En `prestamos.html`, busca `window.CONFIG_LUJAN` y llena:
- `PAGO`: banco, titular y CLABE/tarjeta donde los clientes depositan cada sábado
  (si lo dejas vacío, el cliente verá un botón para pedirlos por WhatsApp).
- `FACEBOOK_URL` / `INSTAGRAM_URL`: enlaces de redes (si están vacíos, se ocultan los íconos).
- Teléfono, correo y ciudad.

## 3. Textos legales
El Aviso de privacidad, los Términos y el contrato son plantillas. Pide a un abogado que los revise.

## 4. Recomendado
- En Firebase Console → Authentication → Templates, pon en español el correo de "restablecer contraseña".
- Considera verificar el correo del administrador y activar la verificación en dos pasos en esa cuenta de Google.

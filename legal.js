/* ==================================================================
   DOCUMENTOS LEGALES — Grupo Luján Financiera
   Lo usan prestamos.html (cliente) y admin.html (administrador).
   ⚠️ Plantillas base: pide a tu abogado que las revise antes de usarlas.
   ================================================================== */
window.LEGAL = (function () {
  var ACREEDOR = {
    NOMBRE: "JESÚS GERARDO LUJÁN RODRÍGUEZ",          // titular de todos los contratos
    NOMBRE_COMERCIAL: "GRUPO LUJÁN FINANCIERA",
    DOMICILIO: "",                                   // 👈 domicilio completo del acreedor (calle, número, colonia, C.P.)
    CIUDAD: "Torreón, Coahuila de Zaragoza",
    EMAIL: "hola@grupolujanfinanciera.com",
    TELEFONO: "871 117 4795"
  };
  var MORATORIO_MENSUAL = 3;   // 👈 % mensual de interés moratorio sobre lo vencido
  var DOCS = [
    { id: "privacidad", titulo: "Aviso de privacidad y políticas del servicio" },
    { id: "contrato",   titulo: "Contrato de préstamo de confianza (mutuo con interés)" },
    { id: "pagare",     titulo: "Pagaré por el monto total (capital + intereses)" }
  ];
  var TIPOS_ID = {
    INE:       { nombre: "Credencial para votar (INE)", fotos: ["Frente", "Reverso"] },
    PASAPORTE: { nombre: "Pasaporte mexicano", fotos: ["Página con fotografía"] },
    LICENCIA:  { nombre: "Licencia de conducir", fotos: ["Frente", "Reverso"] },
    CEDULA:    { nombre: "Cédula profesional", fotos: ["Frente", "Reverso"] },
    MIGRATORIA:{ nombre: "Tarjeta de residente (extranjeros)", fotos: ["Frente", "Reverso"] }
  };
  var TIPOS_DOM = {
    CFE: "Recibo de luz (CFE)", AGUA: "Recibo de agua", TEL: "Recibo de teléfono / internet",
    GAS: "Recibo de gas", PREDIAL: "Recibo de predial", BANCO: "Estado de cuenta bancario", OTRO: "Otro comprobante"
  };
  var TIPOS_GAR = {
    FACTURA_AUTO: { nombre: "Factura de vehículo", fotos: ["Factura (frente)", "Factura (reverso)", "Tarjeta de circulación"] },
    ESCRITURA:    { nombre: "Escritura de inmueble", fotos: ["Primera hoja", "Hoja de datos del inmueble", "Hoja de firmas / registro"] },
    FACTURA_BIEN: { nombre: "Factura de bien mueble (maquinaria, equipo, etc.)", fotos: ["Factura", "Foto del bien"] },
    NOMINA:       { nombre: "Comprobantes de ingresos (recibos de nómina)", fotos: ["Recibo 1", "Recibo 2"] },
    NEGOCIO:      { nombre: "Documentos del negocio (constancia fiscal, licencia, etc.)", fotos: ["Documento 1", "Documento 2"] },
    OTRO:         { nombre: "Otro documento de garantía", fotos: ["Documento 1", "Documento 2"] }
  };

  /* ---------- utilidades ---------- */
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function m2(n) { return "$" + Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fFecha(d) { return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" }); }
  function aFecha(v) { if (!v) return null; if (v instanceof Date) return v; if (v.toDate) return v.toDate(); return new Date(v); }

  var U = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE",
    "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIÚN", "VEINTIDÓS", "VEINTITRÉS", "VEINTICUATRO", "VEINTICINCO",
    "VEINTISÉIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
  var D = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  var C = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
  function dec(n) { if (n < 30) return U[n]; var d = Math.floor(n / 10), u = n % 10; return D[d] + (u ? " Y " + U[u] : ""); }
  function cen(n) { if (n === 100) return "CIEN"; var c = Math.floor(n / 100), r = n % 100; return (C[c] + (c && r ? " " : "") + dec(r)).trim(); }
  function enteroLetras(n) {
    if (n === 0) return "CERO";
    var mill = Math.floor(n / 1e6), mil = Math.floor((n % 1e6) / 1000), r = n % 1000, out = [];
    if (mill) out.push(mill === 1 ? "UN MILLÓN" : cen(mill) + " MILLONES");
    if (mil) out.push(mil === 1 ? "MIL" : cen(mil) + " MIL");
    if (r) out.push(cen(r));
    return out.join(" ");
  }
  /** 12500.5 → "DOCE MIL QUINIENTOS PESOS 50/100 M.N." */
  function numLetras(n) {
    n = Math.round(Number(n || 0) * 100) / 100;
    var ent = Math.floor(n), cts = Math.round((n - ent) * 100);
    var txt = enteroLetras(ent);
    var deP = (ent >= 1e6 && ent % 1e6 === 0) ? " DE" : "";
    return txt + deP + (ent === 1 ? " PESO " : " PESOS ") + String(cts).padStart(2, "0") + "/100 M.N.";
  }
  function importe(n) { return "<b>" + m2(n) + " (" + numLetras(n) + ")</b>"; }

  /* Mismo calendario que el portal: el primer pago es el primer sábado DESPUÉS del inicio. */
  function sabados(inicio, plazo) {
    var first = new Date(inicio); first.setHours(0, 0, 0, 0);
    var dias = (6 - first.getDay() + 7) % 7; if (dias === 0) dias = 7;
    first.setDate(first.getDate() + dias);
    var out = []; for (var i = 0; i < plazo; i++) { var d = new Date(first); d.setDate(first.getDate() + i * 7); out.push(d); } return out;
  }

  function calc(s, opt) {
    var plazo = Number(s.plazo) || 16, cuota = Number(s.cuotaSemanal) || 0, monto = Number(s.monto) || 0;
    var total = cuota * plazo, interes = total - monto;
    var tasa = monto ? (interes / monto / plazo * 100) : 0;
    var firma = aFecha(opt.fechaFirma) || new Date();
    var inicio = aFecha(s.fechaInicio) || firma;
    var fechas = sabados(inicio, plazo);
    return { plazo: plazo, cuota: cuota, monto: monto, total: total, interes: interes, tasa: tasa, firma: firma, inicio: inicio, fechas: fechas };
  }
  function deudor(s) {
    var moral = s.tipoDeudor === "moral";
    return {
      moral: moral,
      nombreLegal: moral ? (s.razonSocial || s.nombre) : s.nombre,
      encabezado: moral
        ? "<b>" + esc((s.razonSocial || "").toUpperCase()) + "</b>" + (s.rfc ? ", con RFC <b>" + esc(s.rfc) + "</b>," : "") +
          " representada en este acto por <b>" + esc((s.nombre || "").toUpperCase()) + "</b> en su carácter de representante legal"
        : "<b>" + esc((s.nombre || "").toUpperCase()) + "</b>, por su propio derecho" + (s.rfc ? ", con RFC/CURP <b>" + esc(s.rfc) + "</b>" : "")
    };
  }
  function domAcreedor() { return ACREEDOR.DOMICILIO ? esc(ACREEDOR.DOMICILIO) + ", " + esc(ACREEDOR.CIUDAD) : esc(ACREEDOR.CIUDAD); }
  function idTxt(s) { var t = TIPOS_ID[s.idTipo]; return t ? t.nombre : "identificación oficial"; }
  function garTxt(s) {
    var t = TIPOS_GAR[s.garantiaTipo];
    return (t ? t.nombre : "documentación de garantía") + (s.garantiaDesc ? ": " + esc(s.garantiaDesc) : "");
  }

  function firmas(s, opt, d) {
    var f = opt.firma || {};
    var img = f.img ? '<img src="' + esc(f.img) + '" alt="Firma" class="lg-firma-img">' : '<div class="lg-firma-vacia"></div>';
    var acrImg = ACREEDOR.FIRMA_IMG ? '<img src="' + esc(ACREEDOR.FIRMA_IMG) + '" alt="Firma" class="lg-firma-img">' : '<div class="lg-firma-vacia"></div>';
    return '<div class="lg-firmas">' +
      '<div class="lg-firma">' + acrImg + '<div class="lg-linea">' + (opt.etiquetaA || "EL MUTUANTE") + "<br><b>" + ACREEDOR.NOMBRE + "</b></div></div>" +
      '<div class="lg-firma">' + img + '<div class="lg-linea">' + (opt.etiquetaB || "EL MUTUARIO") + "<br><b>" + esc(d.nombreLegal.toUpperCase()) + "</b>" +
      (d.moral ? "<br><small>Por conducto de su representante legal: " + esc(s.nombre) + "</small>" : "") + "</div></div></div>" +
      (f.fecha ? '<p class="lg-sello">Firmado electrónicamente el ' + esc(f.fecha) + (f.hash ? " · Huella digital (SHA-256): <code>" + esc(f.hash) + "</code>" : "") + "</p>" : "");
  }

  /* ================= 1. AVISO DE PRIVACIDAD Y POLÍTICAS ================= */
  function privacidad(s, opt) {
    opt = opt || {}; var k = calc(s, opt), d = deudor(s);
    return '<article class="lg-doc" data-doc="privacidad">' +
      "<h2>AVISO DE PRIVACIDAD INTEGRAL Y POLÍTICAS DEL SERVICIO</h2>" +
      '<p class="lg-sub">' + ACREEDOR.NOMBRE_COMERCIAL + " · Folio " + esc(s.id || "—") + "</p>" +
      "<h3>I. Identidad y domicilio del responsable</h3>" +
      "<p><b>" + ACREEDOR.NOMBRE + "</b>, persona física con actividad empresarial que opera comercialmente bajo el nombre de <b>" + ACREEDOR.NOMBRE_COMERCIAL +
      "</b> (en lo sucesivo, <b>“EL RESPONSABLE”</b>), con domicilio en " + domAcreedor() +
      ", es responsable del tratamiento de los datos personales de <b>" + esc(d.nombreLegal) + "</b> (en lo sucesivo, <b>“EL TITULAR”</b>), de conformidad con la " +
      "Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables.</p>" +
      "<h3>II. Datos personales que se recaban</h3><ul>" +
      "<li><b>Identificación:</b> nombre completo, " + idTxt(s) + ", RFC o CURP, firma autógrafa digitalizada" + (d.moral ? ", razón social y datos del representante legal" : "") + ".</li>" +
      "<li><b>Contacto:</b> domicilio, teléfono y correo electrónico.</li>" +
      "<li><b>Patrimoniales y financieros:</b> cuenta CLABE, comprobantes de pago, comprobante de domicilio y documentación de garantía (" + garTxt(s) + ").</li>" +
      "<li><b>De terceros:</b> nombre y teléfono de referencias personales, quienes EL TITULAR declara haber informado y de quienes obtuvo su consentimiento.</li></ul>" +
      "<p>Los datos patrimoniales y financieros se tratan con su <b>consentimiento expreso</b>, que EL TITULAR otorga al firmar el presente aviso. No se recaban datos personales sensibles.</p>" +
      "<h3>III. Finalidades del tratamiento</h3>" +
      "<p><b>Finalidades primarias</b> (necesarias para la relación jurídica): (a) verificar la identidad y la veracidad de la información; (b) evaluar la solicitud y la capacidad de pago; " +
      "(c) formalizar el contrato de préstamo y el pagaré; (d) entregar el préstamo y administrar, confirmar y cobrar los pagos; (e) localizar a EL TITULAR en caso de atraso; " +
      "(f) cumplir obligaciones legales y atender requerimientos de autoridad; (g) ejercer o defender derechos ante tribunales.</p>" +
      "<p><b>Finalidades secundarias:</b> ofrecer renovaciones y nuevos productos. EL TITULAR puede negarse en cualquier momento escribiendo a <b>" + esc(ACREEDOR.EMAIL) + "</b>, sin que ello afecte su préstamo.</p>" +
      "<h3>IV. Transferencias</h3>" +
      "<p>EL RESPONSABLE no vende ni cede datos personales. Únicamente se comunicarán a: proveedores de servicios tecnológicos y de almacenamiento que actúan por cuenta de EL RESPONSABLE (remisiones); " +
      "autoridades competentes cuando exista mandato legal; y abogados o despachos de cobranza en caso de incumplimiento, supuestos que no requieren consentimiento conforme a la ley.</p>" +
      "<h3>V. Derechos ARCO y revocación del consentimiento</h3>" +
      "<p>EL TITULAR puede Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos (derechos ARCO), así como revocar su consentimiento o limitar su uso, mediante solicitud a <b>" + esc(ACREEDOR.EMAIL) +
      "</b> que contenga nombre, medio para recibir respuesta, copia de identificación y descripción clara de lo solicitado. EL RESPONSABLE responderá dentro de los plazos que marca la ley. " +
      "La cancelación no procederá mientras exista un adeudo vigente o cuando los datos deban conservarse por obligación legal.</p>" +
      "<h3>VI. Conservación y seguridad</h3>" +
      "<p>Los datos se conservan durante la relación jurídica y por el plazo de prescripción de las acciones derivadas de ella. Se protegen con medidas de seguridad administrativas, técnicas y físicas; " +
      "el acceso a los documentos está restringido al personal autorizado.</p>" +
      "<h3>VII. Uso de medios electrónicos</h3>" +
      "<p>El sitio utiliza almacenamiento local y cookies técnicas necesarias para mantener la sesión. No se usan para publicidad de terceros.</p>" +
      "<h3>VIII. Políticas del servicio</h3><ol>" +
      "<li><b>Veracidad.</b> Toda la información y documentación proporcionada debe ser verdadera y vigente. La falsedad es causa de rechazo, de vencimiento anticipado y, en su caso, de las acciones legales procedentes.</li>" +
      "<li><b>Pagos.</b> Los pagos son semanales, cada sábado, por " + m2(k.cuota) + ", mediante depósito o transferencia a las cuentas que EL RESPONSABLE indique en la plataforma, o en efectivo contra recibo. El pago se tiene por realizado cuando EL RESPONSABLE lo confirma.</li>" +
      "<li><b>Atrasos.</b> El atraso genera intereses moratorios del " + MORATORIO_MENSUAL + "% mensual sobre lo vencido, conforme al contrato.</li>" +
      "<li><b>Cobranza.</b> Las gestiones de cobranza se realizarán de manera respetuosa, en días y horas hábiles (8:00 a 21:00 h), sin amenazas, intimidación ni uso de lenguaje ofensivo, y sin contactar a terceros distintos de las referencias y obligados proporcionados.</li>" +
      "<li><b>Garantías.</b> La documentación de garantía se recibe en copia digital como respaldo de la solvencia de EL TITULAR y se resguarda de forma confidencial.</li>" +
      "<li><b>Cuenta de acceso.</b> EL TITULAR es responsable de la confidencialidad de su contraseña y de las operaciones realizadas con ella.</li>" +
      "<li><b>Atención y aclaraciones.</b> Al " + esc(ACREEDOR.TELEFONO) + " o en " + esc(ACREEDOR.EMAIL) + ".</li></ol>" +
      "<h3>IX. Cambios al aviso</h3><p>Cualquier modificación se comunicará en la plataforma.</p>" +
      "<p><b>Consentimiento.</b> EL TITULAR manifiesta haber leído el presente Aviso de Privacidad y las Políticas del Servicio, y otorga su consentimiento expreso para el tratamiento de sus datos personales, incluidos los patrimoniales y financieros, para las finalidades descritas.</p>" +
      "<p>En " + esc(ACREEDOR.CIUDAD) + ", a " + fFecha(k.firma) + ".</p>" +
      firmas(s, Object.assign({}, opt, { etiquetaA: "EL RESPONSABLE", etiquetaB: "EL TITULAR" }), d) +
      "</article>";
  }

  /* ================= 2. CONTRATO DE PRÉSTAMO DE CONFIANZA ================= */
  function contrato(s, opt) {
    opt = opt || {}; var k = calc(s, opt), d = deudor(s);
    var capSem = k.monto / k.plazo, intSem = k.interes / k.plazo;
    var entregaPrev = s.origen === "admin";
    var filas = k.fechas.map(function (f, i) {
      var saldo = k.total - k.cuota * (i + 1);
      return "<tr><td>" + (i + 1) + "</td><td>" + f.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) + "</td><td>" + m2(capSem) + "</td><td>" + m2(intSem) + "</td><td>" + m2(k.cuota) + "</td><td>" + m2(Math.max(saldo, 0)) + "</td></tr>";
    }).join("");
    var mutuario = d.moral
      ? "<li>Que es una persona moral legalmente constituida conforme a las leyes mexicanas, denominada <b>" + esc(s.razonSocial) + "</b>" + (s.rfc ? ", con RFC " + esc(s.rfc) : "") +
        ", y que su representante legal, <b>" + esc(s.nombre) + "</b>, cuenta con facultades suficientes para obligarla en los términos de este contrato, mismas que no le han sido revocadas ni limitadas.</li>"
      : "<li>Que es persona física, mayor de edad, con plena capacidad legal para obligarse, y que se identifica con " + idTxt(s) + ".</li>";
    return '<article class="lg-doc" data-doc="contrato">' +
      "<h2>CONTRATO DE PRÉSTAMO DE CONFIANZA<br><small>(MUTUO CON INTERÉS)</small></h2>" +
      '<p class="lg-sub">Folio ' + esc(s.id || "—") + " · " + ACREEDOR.NOMBRE_COMERCIAL + "</p>" +
      "<p>CONTRATO DE PRÉSTAMO DE CONFIANZA EN LA MODALIDAD DE MUTUO CON INTERÉS que celebran, por una parte, <b>" + ACREEDOR.NOMBRE + "</b>, por su propio derecho, quien opera comercialmente bajo el nombre de <b>" +
      ACREEDOR.NOMBRE_COMERCIAL + "</b> (en lo sucesivo <b>“EL MUTUANTE”</b>), y por la otra " + d.encabezado + " (en lo sucesivo <b>“EL MUTUARIO”</b>), a quienes conjuntamente se les denominará <b>“LAS PARTES”</b>, al tenor de las siguientes declaraciones y cláusulas:</p>" +
      "<h3>DECLARACIONES</h3>" +
      "<p><b>I. Declara EL MUTUANTE:</b></p><ol type=\"a\">" +
      "<li>Que es persona física, de nacionalidad mexicana, mayor de edad y con plena capacidad legal para celebrar el presente contrato.</li>" +
      "<li>Que señala como domicilio para los efectos de este contrato el ubicado en " + domAcreedor() + ".</li>" +
      "<li>Que es su voluntad otorgar a EL MUTUARIO el préstamo objeto de este contrato, en los términos y condiciones que más adelante se establecen.</li></ol>" +
      "<p><b>II. Declara EL MUTUARIO, bajo protesta de decir verdad:</b></p><ol type=\"a\">" + mutuario +
      "<li>Que su domicilio es el ubicado en <b>" + esc(s.domicilio || "—") + "</b>, teléfono " + esc(s.telefono || "—") + (s.email ? " y correo electrónico " + esc(s.email) : "") + ".</li>" +
      "<li>Que la información y los documentos proporcionados (identificación, comprobante de domicilio, cuenta CLABE, referencias y documentación de garantía) son verdaderos, vigentes y le pertenecen.</li>" +
      "<li>Que cuenta con la capacidad económica para cumplir puntualmente con las obligaciones de pago que asume, que los recursos con los que pagará son de procedencia lícita y que destinará el préstamo a fines lícitos.</li>" +
      "<li>Que conoce y acepta el monto, intereses, plazo, fechas de pago y total a pagar que se señalan en este contrato y en su Anexo A, información que le fue presentada antes de firmar.</li></ol>" +
      "<p><b>III. Declaran LAS PARTES</b> que se reconocen mutuamente la personalidad con la que comparecen; que en la celebración de este contrato no existe error, dolo, mala fe, violencia ni lesión; " +
      "y que es su voluntad otorgar su consentimiento por medios electrónicos en términos de los artículos 1803 y 1834 Bis del Código Civil Federal y 89 a 94 del Código de Comercio.</p>" +
      "<h3>CLÁUSULAS</h3>" +
      "<p><b>PRIMERA. Objeto.</b> En términos de los artículos 2384 a 2397 del Código Civil Federal, sus correlativos del Código Civil para el Estado de Coahuila de Zaragoza y, en lo aplicable, los artículos 358 a 364 del Código de Comercio, " +
      "EL MUTUANTE transfiere en préstamo a EL MUTUARIO la propiedad de la cantidad de " + importe(k.monto) + " (en lo sucesivo, “EL CAPITAL”), y EL MUTUARIO se obliga a restituirla junto con los intereses pactados, en la forma y plazos convenidos.</p>" +
      (entregaPrev
        ? "<p><b>SEGUNDA. Entrega.</b> EL MUTUARIO reconoce haber recibido EL CAPITAL a su entera satisfacción el día <b>" + fFecha(k.inicio) + "</b>, por lo que el presente contrato hace las veces del recibo más amplio que en derecho proceda.</p>"
        : "<p><b>SEGUNDA. Entrega.</b> EL MUTUANTE entregará EL CAPITAL mediante transferencia electrónica a la cuenta CLABE <b>" + esc(s.clabe || "—") + "</b> designada por EL MUTUARIO. El comprobante de la transferencia hará las veces de recibo de entrega.</p>") +
      "<p><b>TERCERA. Interés ordinario.</b> EL CAPITAL causará un interés ordinario fijo por la cantidad total de " + importe(k.interes) + ", equivalente a una tasa simple de <b>" + k.tasa.toFixed(2) +
      "% semanal</b> sobre EL CAPITAL durante el plazo pactado, que EL MUTUARIO acepta expresamente. Los intereses no se capitalizarán. El interés se encuentra incluido en cada pago semanal.</p>" +
      "<p><b>CUARTA. Plazo y forma de pago.</b> EL MUTUARIO se obliga a pagar la cantidad total de " + importe(k.total) + " mediante <b>" + k.plazo + " pagos semanales</b> consecutivos de " + importe(k.cuota) +
      " cada uno, que vencerán <b>cada sábado</b>, siendo el primero el día <b>" + fFecha(k.fechas[0]) + "</b> y el último el día <b>" + fFecha(k.fechas[k.fechas.length - 1]) + "</b>, conforme al calendario del <b>Anexo A</b>, que forma parte integrante de este contrato.</p>" +
      "<p><b>QUINTA. Lugar y medio de pago.</b> Los pagos se harán mediante depósito o transferencia a la cuenta que EL MUTUANTE indique en la plataforma, o en efectivo en el domicilio de EL MUTUANTE contra la entrega de recibo. " +
      "EL MUTUARIO subirá a la plataforma el comprobante de cada pago; el pago se tendrá por realizado cuando EL MUTUANTE lo confirme.</p>" +
      "<p><b>SEXTA. Aplicación de pagos.</b> Los pagos se aplicarán en el siguiente orden: gastos de cobranza que en su caso se hayan generado, intereses moratorios, intereses ordinarios y, por último, capital, conforme al artículo 364 del Código de Comercio.</p>" +
      "<p><b>SÉPTIMA. Pago anticipado.</b> EL MUTUARIO podrá liquidar anticipadamente, total o parcialmente, el saldo a su cargo sin penalización alguna, solicitando previamente a EL MUTUANTE el importe a liquidar.</p>" +
      "<p><b>OCTAVA. Intereses moratorios.</b> En caso de que EL MUTUARIO no cubra cualquier pago en la fecha de su vencimiento, pagará intereses moratorios a razón del <b>" + MORATORIO_MENSUAL +
      "% mensual</b> sobre el importe vencido, calculados por los días efectivamente transcurridos desde la fecha de vencimiento hasta la de su pago total.</p>" +
      "<p><b>NOVENA. Vencimiento anticipado.</b> EL MUTUANTE podrá dar por vencido anticipadamente el plazo y exigir el pago total del saldo insoluto, con sus accesorios, si EL MUTUARIO: (a) deja de cubrir dos o más pagos semanales; " +
      "(b) proporcionó información o documentación falsa; (c) enajena, grava u oculta los bienes descritos en la documentación de garantía; o (d) incumple cualquier otra obligación de este contrato.</p>" +
      "<p><b>DÉCIMA. Documentación de garantía.</b> Como respaldo de su solvencia y del cumplimiento de sus obligaciones, EL MUTUARIO presenta en copia digital la siguiente documentación: <b>" + garTxt(s) + "</b>. " +
      "EL MUTUARIO declara bajo protesta de decir verdad que es legítimo propietario de los bienes o titular de los derechos que ampara dicha documentación, que se encuentran libres de gravamen y se obliga a no enajenarlos ni gravarlos mientras exista saldo a su cargo. " +
      "La entrega de esta documentación no constituye prenda ni hipoteca; de convenirse alguna de ellas, se formalizará en instrumento por separado con las formalidades de ley.</p>" +
      "<p><b>DÉCIMA PRIMERA. Pagaré.</b> Para documentar y garantizar el pago del total adeudado, EL MUTUARIO suscribe en esta misma fecha, a la orden de EL MUTUANTE, un pagaré por la cantidad de " + importe(k.total) +
      ", que comprende capital e intereses ordinarios. Los pagos realizados conforme a este contrato se abonarán al importe del pagaré, el cual será devuelto o cancelado al quedar liquidado el adeudo. La suscripción del pagaré no implica novación de las obligaciones aquí pactadas.</p>" +
      "<p><b>DÉCIMA SEGUNDA. Confianza y confidencialidad.</b> El presente préstamo se otorga con base en la confianza depositada en la veracidad de las declaraciones de EL MUTUARIO. LAS PARTES se obligan a guardar confidencialidad sobre las condiciones de este contrato, salvo requerimiento de autoridad o necesidad de ejercer los derechos derivados de él.</p>" +
      "<p><b>DÉCIMA TERCERA. Referencias.</b> EL MUTUARIO autoriza a EL MUTUANTE a contactar a las referencias proporcionadas únicamente con fines de localización, sin revelarles la información del adeudo.</p>" +
      "<p><b>DÉCIMA CUARTA. Domicilios y notificaciones.</b> LAS PARTES señalan como domicilios los indicados en las declaraciones. Las comunicaciones realizadas a través de la plataforma, del correo electrónico o del teléfono (incluido WhatsApp) proporcionados surtirán plenos efectos. " +
      "EL MUTUARIO se obliga a avisar cualquier cambio de domicilio o teléfono dentro de los cinco días siguientes.</p>" +
      "<p><b>DÉCIMA QUINTA. Datos personales.</b> EL MUTUARIO reconoce que conoce y acepta el Aviso de Privacidad y las Políticas del Servicio que firma en este mismo acto.</p>" +
      "<p><b>DÉCIMA SEXTA. Cesión.</b> EL MUTUANTE podrá ceder o transmitir los derechos derivados de este contrato y del pagaré, notificándolo a EL MUTUARIO. EL MUTUARIO no podrá ceder sus obligaciones sin consentimiento previo y por escrito de EL MUTUANTE.</p>" +
      "<p><b>DÉCIMA SÉPTIMA. Firma electrónica.</b> LAS PARTES acuerdan que la firma trazada por EL MUTUARIO en la plataforma, asociada a su cuenta de acceso, a la fecha y hora de firma y a la huella digital (SHA-256) del documento, constituye su firma electrónica y produce los mismos efectos que la firma autógrafa, en términos de los artículos 1803 y 1834 Bis del Código Civil Federal y 89, 93 y 97 del Código de Comercio. " +
      "EL MUTUARIO podrá solicitar en cualquier momento un ejemplar impreso de este contrato y se obliga a firmarlo de forma autógrafa cuando EL MUTUANTE así lo requiera.</p>" +
      "<p><b>DÉCIMA OCTAVA. Legislación aplicable y jurisdicción.</b> Para la interpretación y cumplimiento de este contrato, LAS PARTES se someten a las leyes aplicables y a la jurisdicción de los tribunales competentes de " + esc(ACREEDOR.CIUDAD) + ", renunciando expresamente a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.</p>" +
      "<p>Leído que fue el presente contrato y enteradas LAS PARTES de su contenido y alcance legal, lo firman en " + esc(ACREEDOR.CIUDAD) + ", el día " + fFecha(k.firma) + ".</p>" +
      firmas(s, opt, d) +
      '<h3 class="lg-anexo">ANEXO A · Resumen y calendario de pagos</h3>' +
      '<table class="lg-tabla lg-resumen"><tbody>' +
      "<tr><th>Capital prestado</th><td>" + m2(k.monto) + "</td></tr><tr><th>Interés ordinario total</th><td>" + m2(k.interes) + " (" + k.tasa.toFixed(2) + "% semanal simple)</td></tr>" +
      "<tr><th>Total a pagar</th><td>" + m2(k.total) + "</td></tr><tr><th>Pago semanal</th><td>" + m2(k.cuota) + " × " + k.plazo + " semanas (cada sábado)</td></tr>" +
      "<tr><th>Interés moratorio</th><td>" + MORATORIO_MENSUAL + "% mensual sobre lo vencido</td></tr></tbody></table>" +
      '<div class="lg-scroll"><table class="lg-tabla"><thead><tr><th>#</th><th>Vence</th><th>Capital</th><th>Interés</th><th>Pago</th><th>Saldo</th></tr></thead><tbody>' + filas + "</tbody></table></div>" +
      "</article>";
  }

  /* ================= 3. PAGARÉ ================= */
  function pagare(s, opt) {
    opt = opt || {}; var k = calc(s, opt), d = deudor(s);
    var venc = k.fechas[k.fechas.length - 1];
    var f = opt.firma || {};
    return '<article class="lg-doc lg-pagare" data-doc="pagare">' +
      '<div class="lg-pg-top"><div><span class="lg-pg-lbl">PAGARÉ</span><div class="lg-pg-no">No. ' + esc(s.id || "—") + "</div></div>" +
      '<div class="lg-pg-bueno"><span>BUENO POR</span><b>' + m2(k.total) + "</b></div></div>" +
      '<p class="lg-pg-lugar">En ' + esc(ACREEDOR.CIUDAD) + ", a " + fFecha(k.firma) + ".</p>" +
      "<p>Por este <b>PAGARÉ</b>, " + (d.moral ? "la suscrita <b>" + esc(d.nombreLegal.toUpperCase()) + "</b>, por conducto de su representante legal, <b>debe y pagará</b>" : "<b>debo y pagaré</b>") +
      " incondicionalmente a la orden de <b>" + ACREEDOR.NOMBRE + "</b>, en " + esc(ACREEDOR.CIUDAD) + (ACREEDOR.DOMICILIO ? ", en el domicilio ubicado en " + esc(ACREEDOR.DOMICILIO) : "") +
      ", o en cualquier otro lugar en que se requiera el pago, el día <b>" + fFecha(venc) + "</b>, la cantidad de " + importe(k.total) + ", valor recibido a " + (d.moral ? "su" : "mi") + " entera satisfacción.</p>" +
      "<p>La cantidad anterior comprende el capital de " + m2(k.monto) + " y los intereses ordinarios pactados de " + m2(k.interes) + ", derivados del Contrato de Préstamo de Confianza con folio " + esc(s.id || "—") + ".</p>" +
      "<p>De no ser pagado a su vencimiento, este pagaré causará <b>intereses moratorios a razón del " + MORATORIO_MENSUAL + "% mensual</b> sobre la suma principal, desde la fecha de su vencimiento hasta su total liquidación, pagaderos conjuntamente con el principal.</p>" +
      "<p>Los abonos que se realicen se anotarán en el registro de pagos de la plataforma o al reverso de este documento. Este pagaré no requiere protesto para su cobro.</p>" +
      '<p class="lg-pg-ley">Pagaré suscrito conforme a los artículos 170, 171, 173 y 174 de la Ley General de Títulos y Operaciones de Crédito.</p>' +
      '<div class="lg-pg-datos"><div><span>Suscriptor</span><b>' + esc(d.nombreLegal.toUpperCase()) + "</b>" + (d.moral ? "<small>Representante legal: " + esc(s.nombre) + "</small>" : "") + "</div>" +
      "<div><span>Domicilio del suscriptor</span><b>" + esc(s.domicilio || "—") + "</b></div>" +
      "<div><span>Teléfono</span><b>" + esc(s.telefono || "—") + "</b></div>" +
      (s.rfc ? "<div><span>RFC / CURP</span><b>" + esc(s.rfc) + "</b></div>" : "") + "</div>" +
      '<div class="lg-firmas lg-una"><div class="lg-firma">' + (f.img ? '<img src="' + esc(f.img) + '" alt="Firma" class="lg-firma-img">' : '<div class="lg-firma-vacia"></div>') +
      '<div class="lg-linea">ACEPTO · FIRMA DEL SUSCRIPTOR<br><b>' + esc(d.nombreLegal.toUpperCase()) + "</b></div></div></div>" +
      (f.fecha ? '<p class="lg-sello">Firmado electrónicamente el ' + esc(f.fecha) + (f.hash ? " · Huella digital (SHA-256): <code>" + esc(f.hash) + "</code>" : "") + "</p>" : "") +
      "</article>";
  }

  function render(id, s, opt) { return id === "privacidad" ? privacidad(s, opt) : id === "contrato" ? contrato(s, opt) : pagare(s, opt); }
  function todos(s, opt) { return DOCS.map(function (x) { return render(x.id, s, opt); }).join('<div class="lg-salto"></div>'); }

  /* Huella digital SHA-256 del texto de los documentos (evidencia de lo que se firmó) */
  function huella(s, opt) {
    var div = document.createElement("div"); div.innerHTML = todos(s, { fechaFirma: opt && opt.fechaFirma });
    var txt = div.textContent.replace(/\s+/g, " ").trim();
    if (!(window.crypto && crypto.subtle)) return Promise.resolve("");
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    }).catch(function () { return ""; });
  }

  /* Estilos de los documentos (pantalla + impresión) */
  var CSS = ".lg-doc{background:#fff;color:#1d2433;font:14px/1.6 Georgia,'Times New Roman',serif;padding:34px 38px;border:1px solid #dfe3ea;border-radius:12px;box-shadow:inset 0 0 0 5px #f6f7f9}" +
    ".lg-doc h2{font:700 1.08rem/1.35 Montserrat,Arial,sans-serif;text-align:center;letter-spacing:.04em;color:#06142a;margin:0 0 4px}" +
    ".lg-doc h2 small{font-size:.8em;font-weight:600;letter-spacing:.08em}" +
    ".lg-doc h3{font:700 .86rem Montserrat,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#06142a;margin:20px 0 6px;border-bottom:1px solid #e6dcc0;padding-bottom:4px}" +
    ".lg-doc p,.lg-doc li{text-align:justify;margin:.55em 0}.lg-doc ol,.lg-doc ul{padding-left:1.4em}.lg-doc b{color:#06142a}" +
    ".lg-sub{text-align:center!important;color:#7a6326;font:600 .78rem Montserrat,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px!important}" +
    ".lg-firmas{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:30px}.lg-firmas.lg-una{grid-template-columns:minmax(0,340px);justify-content:center}" +
    ".lg-firma{text-align:center;display:flex;flex-direction:column;justify-content:flex-end}.lg-firma-img{max-width:100%;height:84px;object-fit:contain;margin:0 auto -6px}.lg-firma-vacia{height:78px}" +
    ".lg-linea{border-top:1px solid #1d2433;padding-top:6px;font:600 .72rem/1.5 Montserrat,Arial,sans-serif;letter-spacing:.05em}.lg-linea b{font-size:.82rem}" +
    ".lg-sello{font:.72rem/1.5 Arial,sans-serif!important;color:#5b6475;text-align:center!important;margin-top:14px!important;word-break:break-all}.lg-sello code{font-size:.68rem}" +
    ".lg-tabla{width:100%;border-collapse:collapse;font:.8rem Arial,sans-serif;margin-top:8px}.lg-tabla th,.lg-tabla td{border:1px solid #dfe3ea;padding:6px 8px;text-align:left}.lg-tabla thead th{background:#06142a;color:#fff;font-weight:600}" +
    ".lg-resumen th{background:#f6f7f9;width:44%;font-weight:600}.lg-scroll{overflow-x:auto}.lg-anexo{margin-top:30px!important}" +
    ".lg-pagare{border:2px solid #06142a;box-shadow:inset 0 0 0 6px #fff,inset 0 0 0 7px #c9a54a}" +
    ".lg-pg-top{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:2px solid #c9a54a;padding-bottom:12px;margin-bottom:12px}" +
    ".lg-pg-lbl{font:800 1.7rem Montserrat,Arial,sans-serif;letter-spacing:.18em;color:#06142a}.lg-pg-no{font:.75rem Arial,sans-serif;color:#5b6475;word-break:break-all}" +
    ".lg-pg-bueno{background:#06142a;color:#fff;border-radius:8px;padding:8px 14px;text-align:right}.lg-pg-bueno span{display:block;font:600 .66rem Montserrat,Arial,sans-serif;letter-spacing:.12em;color:#e3c77a}.lg-pg-bueno b{color:#fff;font:700 1.25rem Montserrat,Arial,sans-serif}" +
    ".lg-pg-lugar{text-align:right!important;font-style:italic}.lg-pg-ley{font:.74rem Arial,sans-serif!important;color:#5b6475}" +
    ".lg-pg-datos{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;margin-top:16px;padding:12px;background:#f6f7f9;border-radius:8px;font-family:Arial,sans-serif}" +
    ".lg-pg-datos span{display:block;font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:#7a6326;font-weight:700}.lg-pg-datos b{font-size:.84rem}.lg-pg-datos small{display:block;font-size:.74rem}" +
    ".lg-salto{height:22px}" +
    "@media(max-width:640px){.lg-doc{padding:20px 16px;font-size:13.5px;box-shadow:none}.lg-firmas,.lg-pg-datos{grid-template-columns:1fr}.lg-pg-top{flex-direction:column}.lg-pg-bueno{text-align:left;width:100%}}" +
    "@media print{.lg-doc{border:none;box-shadow:none;padding:0}.lg-pagare{border:2px solid #06142a;padding:18px}.lg-salto{break-after:page;height:0}.lg-tabla thead th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}";
  (function () { var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); })();

  /* Abre una ventana lista para imprimir o guardar en PDF */
  function imprimir(html, titulo) {
    var w = window.open("", "_blank");
    if (!w) { alert("Permite las ventanas emergentes para imprimir los documentos."); return; }
    w.document.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(titulo || "Documentos") +
      "</title><style>body{margin:0;padding:24px;background:#fff}" + CSS + "@page{margin:16mm}</style></head><body>" + html +
      "<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>");
    w.document.close();
  }

  return { ACREEDOR: ACREEDOR, MORATORIO_MENSUAL: MORATORIO_MENSUAL, DOCS: DOCS, TIPOS_ID: TIPOS_ID, TIPOS_DOM: TIPOS_DOM, TIPOS_GAR: TIPOS_GAR,
    numLetras: numLetras, render: render, todos: todos, huella: huella, imprimir: imprimir, sabados: sabados };
})();

document.addEventListener("DOMContentLoaded", function () {
    // Verifica que los elementos existan
    const empresa = document.getElementById("empresa");
    const direccion = document.getElementById("direccion");
    const contacto = document.getElementById("contacto");
    const telefono = document.getElementById("telefono");
    const serie = document.getElementById("serie");
    const modelo = document.getElementById("modelo");
    const Contador = document.getElementById("contador");
    const motivo = document.getElementById("motivo");
    const diagnostico = document.getElementById("diagnostico");
    const observaciones = document.getElementById("observaciones");
    const recomendaciones = document.getElementById("recomendaciones");
    const estadoEquipo = document.getElementById("estadoEquipo");
    const fotos = document.getElementById("fotos");
    const NombreTecnico = document.getElementById("NombreTecnico");
    const NombreUsuario = document.getElementById("NombreUsuario");
    const correoUsuario = document.getElementById("correoUsuario");
    const fechaFormateada = document.getElementById("fechaFormateada");
  
    if (
        !empresa || !direccion || !contacto || !telefono || !serie || !modelo || !Contador||!NombreTecnico||
        !motivo || !diagnostico || !observaciones || !recomendaciones || !estadoEquipo || !fotos || !fechaFormateada || !NombreUsuario||!correoUsuario
    ) {
        console.error("Uno o más elementos del formulario no existen.");
        return;
    }

    // Inicializar Signature Pad para las firmas
    const canvasTecnico = document.getElementById("firmaTecnico");
    const canvasResponsable = document.getElementById("firmaResponsable");
   

    if (!canvasTecnico || !canvasResponsable) {
        console.error("No se encontraron los canvas para las firmas.");
        return;
    }

    const firmaTecnico = new SignaturePad(canvasTecnico);
    const firmaResponsable = new SignaturePad(canvasResponsable);

    // Vista previa de las imágenes cargadas
    const inputFotos = document.getElementById("fotos");
    const vistaPreviaFotos = document.getElementById("vistaPreviaFotos");

    inputFotos.addEventListener("change", function () {
        vistaPreviaFotos.innerHTML = ""; // Limpiar vista previa
        Array.from(inputFotos.files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                vistaPreviaFotos.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    // Limpiar firmas
    document.getElementById("limpiarFirmaTecnico").addEventListener("click", function () {
        firmaTecnico.clear();
    });

    document.getElementById("limpiarFirmaResponsable").addEventListener("click", function () {
        firmaResponsable.clear();
    });

    // Generar PDF
    document.getElementById("generarPDF").addEventListener("click", async function () {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        // Configuración inicial
        let y = 20; // Posición vertical inicial
        const margin = 10; // Margen izquierdo
        const lineHeight = 10; // Altura de cada línea
        const pageHeight = 280; // Altura máxima de la página A4


        // Función para agregar texto con ajuste de posición
        function addText(text, maxWidth, isTitle = false, spacing = lineHeight) {
            const lines = pdf.splitTextToSize(text, maxWidth); // Divide el texto en líneas
            lines.forEach((line) => {
                if (y > pageHeight) {
                    pdf.addPage(); // Agregar nueva página si se excede la altura
                    y = 20; // Reiniciar la posición vertical
                }
                if (isTitle) {
                    pdf.setFont("helvetica","bold");
                    pdf.setTextColor(0, 0, 0); // Color Negro  para títulos
                } else {
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(0, 0, 0); // Color negro para texto normal
                }
                pdf.text(line, margin, y); // Agregar la línea al PDF
                y += spacing; // Incrementar la posición vertical con el espaciado personalizado
            });
        
            // Agregar un espacio adicional después del párrafo
            y += spacing * 0.5; // Espacio adicional (mitad del espaciado normal)
        }
        
        
       // Título principal "INFORME TÉCNICO" con fondo negro y texto blanco
pdf.setFontSize(16);
pdf.setFillColor(0, 0, 0); // Fondo negro
pdf.rect(margin, y - 7, 180, 10, 'F'); // Rectángulo de fondo (ajusta el ancho y alto según sea necesario)
pdf.setTextColor(255, 255, 255); // Texto blanco
pdf.setFont("helvetica", "bold");
pdf.text("INFORME TÉCNICO", margin, y); // Agregar el texto sobre el fondo
pdf.text("CODESA", 165, y); // Agregar el texto sobre el fondo
y += lineHeight * 2; // Espacio adicional después del título
pdf.setFillColor(220, 7, 20); // Fondo negro
pdf.rect(margin, y - 16, 180, 5, 'F'); // Rectángulo de fondo (ajusta el ancho y alto según sea necesario)

pdf.setFontSize(10);
pdf.setFillColor(0, 0, 0); // Fondo negro
pdf.setTextColor(255, 255, 255); // Texto blanco
pdf.setFont("helvetica", "normal");
pdf.text("Av. República de Colombia 625 San Isidro", 10, 28); // Agregar el texto sobre el fondo
pdf.text("Garantías 988567385 / 988567385", 135, 28); // Agregar el texto sobre el fondo

        // Información general
        
        pdf.setFontSize(12);
        const lineHeight2 = -5; // Altura de cada línea (espacio mínimo entre elementos)
        
        addText(`Fecha: ${fechaFormateada.textContent}`, 180);
        y += lineHeight2; // Espacio mínimo después de la fecha
        
        addText(`Empresa: ${empresa.value}`, 180);
        y += lineHeight2; // Espacio mínimo después de la empresa
        
        addText(`Dirección: ${direccion.value}`, 180);
        y += lineHeight2; // Espacio mínimo después de la dirección
        
        addText(`Contacto: ${contacto.value}`, 180);
        y += lineHeight2; // Espacio mínimo después del contacto
        
        addText(`Teléfono: ${telefono.value}`, 180);
        y += lineHeight2; // Espacio mínimo después del teléfono
        
        addText(`Serie: ${serie.value}`, 180);
        y += lineHeight2; // Espacio mínimo después de la serie
        
        addText(`Modelo: ${modelo.value}`, 180);
        y += lineHeight2; // Espacio mínimo después del modelo
        
        addText(`Contador: ${Contador.value}`, 180);
        y += lineHeight2; // Espacio mínimo después del contador
        
        addText(`Motivo: ${motivo.value}`, 180);
        y += lineHeight2; // Espacio mínimo después del motivo

        // Diagnóstico Técnico
        pdf.setFontSize(12);
        addText("Diagnostico Tecnico:", 180, true); // Título en rojo
        y += lineHeight * -0.5; // Espacio adicional después del título (1.5 veces el lineHeight)
        pdf.setFontSize(12);
        addText(diagnostico.value, 180,false, 5); // Contenido del diagnóstico

        // Observaciones
        pdf.setFontSize(12);
        addText("Recomendaciones:", 180, true); // Título en rojo
        y += lineHeight * -0.5;
        pdf.setFontSize(12);
        addText(recomendaciones.value, 180,false, 5);

        // Recomendaciones
        pdf.setFontSize(12);
        addText("Observaciones:", 180, true); // Título en rojo
        y += lineHeight * -0.5;
        pdf.setFontSize(12);
        addText(observaciones.value, 180,false, 5);

        
       // Estado del Equipo
pdf.setFontSize(12);

// Combinar el título y el valor seleccionado en una sola cadena
const estadosSeleccionados = Array.from(estadoEquipo.selectedOptions).map(option => option.value).join(", ");
const estadoCompleto = `Estado del Equipo: ${estadosSeleccionados}`;

// Agregar el texto combinado
addText(estadoCompleto, 180, true); // Título en rojo (si addText admite formato)

// Ajustar la posición vertical para el siguiente elemento
y += lineHeight;

        // Agregar imágenes al PDF
        const fotos = inputFotos.files;
        if (fotos.length > 0) {
            pdf.setFontSize(12);
            addText("Registro Fotográfico:", 180, true); // Título en rojo
            y += lineHeight;

            // Función para cargar una imagen y devolver una promesa
            function cargarImagen(file) {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = new Image();
                        img.src = e.target.result;

                        img.onload = function () {
                            resolve(img); // Resuelve la promesa con la imagen cargada
                        };
                    };
                    reader.readAsDataURL(file);
                });
            }

            // Cargar todas las imágenes y esperar a que estén listas
            const imagenes = await Promise.all(Array.from(fotos).map((file) => cargarImagen(file)));

            // Agregar las imágenes al PDF
            for (const img of imagenes) {
                const imgWidth = 80; // Ancho de la imagen en el PDF
                const imgHeight = (img.height * imgWidth) / img.width;

                if (y + imgHeight > pageHeight) {
                    pdf.addPage(); // Agregar nueva página si no hay espacio
                    y = 20;
                }

                pdf.addImage(img, "JPEG", margin, y, imgWidth, imgHeight);
                y += imgHeight + 10; // Espacio después de la imagen
            }
        }

        // Convertir las firmas a imágenes y agregarlas al PDF
        const firmaTecnicoImg = firmaTecnico.toDataURL();
        const firmaResponsableImg = firmaResponsable.toDataURL();

        if (y + 40 > pageHeight) {
            pdf.addPage(); // Agregar nueva página si no hay espacio para las firmas
            y = 20;
        }
        
       // Agregar la imagen de la firma del técnico
pdf.addImage(firmaTecnicoImg, "PNG", margin, y, 80, 40);

// Dibujar un borde alrededor de la imagen de la firma (sin relleno)
pdf.setDrawColor(0); // Color del borde (negro)
pdf.setLineWidth(0.1); // Grosor de la línea del borde
pdf.rect(margin, y, 80, 40); // Borde alrededor de la imagen

// Aumentar el espacio después de la firma del técnico
y += 50;

// Agregar el texto del nombre y firma del técnico
addText(`Nombre y Firma del Tecnico: ${NombreTecnico.value}`, 180);
        

        if (y + 40 > pageHeight) {
            pdf.addPage(); // Agregar nueva página si no hay espacio para la segunda firma
            y = 20;
        }
        pdf.addImage(firmaResponsableImg, "PNG", margin, y, 80, 40);
        pdf.setDrawColor(0); // Color del borde (negro)
        pdf.setLineWidth(0.1); // Grosor de la línea del borde
        pdf.rect(margin, y, 80, 40); // Borde alrededor de la imagen
        y += 50;
        addText(`Nombre y Firma del Usuario: ${NombreUsuario.value}`, 180);
        y += -5;
        addText(`Correo Electronico: ${correoUsuario.value}`, 180);

        // Guardar el PDF
        pdf.save(serie.value + ".pdf");
        alert("El PDF se ha generado correctamente.");
    });
});

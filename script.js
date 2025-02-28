document.addEventListener("DOMContentLoaded", function () {
    // Verifica que los elementos existan
    const empresa = document.getElementById("empresa");
    const direccion = document.getElementById("direccion");
    const contacto = document.getElementById("contacto");
    const telefono = document.getElementById("telefono");
    const serie = document.getElementById("serie");
    const modelo = document.getElementById("modelo");
    const motivo = document.getElementById("motivo");
    const diagnostico = document.getElementById("diagnostico");
    const observaciones = document.getElementById("observaciones");
    const recomendaciones = document.getElementById("recomendaciones");
    const estadoEquipo = document.getElementById("estadoEquipo");
    const fotos = document.getElementById("fotos");

    if (
        !empresa || !direccion || !contacto || !telefono || !serie || !modelo ||
        !motivo || !diagnostico || !observaciones || !recomendaciones || !estadoEquipo || !fotos
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
        function addText(text, maxWidth) {
            const lines = pdf.splitTextToSize(text, maxWidth);
            lines.forEach((line) => {
                if (y > pageHeight) {
                    pdf.addPage(); // Agregar nueva página si se excede la altura
                    y = 20; // Reiniciar la posición vertical
                }
                pdf.text(line, margin, y);
                y += lineHeight;
            });
        }

        // Agregar los datos al PDF
        pdf.setFontSize(18);
        pdf.text("INFORME TÉCNICO", margin, y);
        y += lineHeight * 2; // Espacio adicional después del título

        pdf.setFontSize(12);
        addText(`Empresa: ${empresa.value}`, 180);
        addText(`Dirección: ${direccion.value}`, 180);
        addText(`Contacto: ${contacto.value}`, 180);
        addText(`Teléfono: ${telefono.value}`, 180);
        addText(`Serie: ${serie.value}`, 180);
        addText(`Modelo: ${modelo.value}`, 180);
        addText(`Motivo: ${motivo.value}`, 180);

        // Agregar Diagnóstico Técnico
        pdf.setFontSize(14);
        pdf.text("Diagnóstico Técnico:", margin, y);
        y += lineHeight;
        pdf.setFontSize(12);
        addText(diagnostico.value, 180);

        // Agregar Observaciones
        pdf.setFontSize(14);
        pdf.text("Observaciones:", margin, y);
        y += lineHeight;
        pdf.setFontSize(12);
        addText(observaciones.value, 180);

        // Agregar Recomendaciones
        pdf.setFontSize(14);
        pdf.text("Recomendaciones:", margin, y);
        y += lineHeight;
        pdf.setFontSize(12);
        addText(recomendaciones.value, 180);

        // Agregar Estado del Equipo
        pdf.setFontSize(14);
        pdf.text("Estado del equipo:", margin, y);
        y += lineHeight;
        pdf.setFontSize(12);
        const estadosSeleccionados = Array.from(estadoEquipo.selectedOptions).map(option => option.value).join(", ");
        addText(estadosSeleccionados, 180);

        // Agregar imágenes al PDF
        const fotos = inputFotos.files;
        if (fotos.length > 0) {
            pdf.setFontSize(14);
            pdf.text("Registro Fotográfico:", margin, y);
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
        pdf.addImage(firmaTecnicoImg, "PNG", margin, y, 80, 40);
        y += 50; // Espacio después de la firma del técnico

        if (y + 40 > pageHeight) {
            pdf.addPage(); // Agregar nueva página si no hay espacio para la segunda firma
            y = 20;
        }
        pdf.addImage(firmaResponsableImg, "PNG", margin, y, 80, 40);

        // Guardar el PDF
        pdf.save("informe_tecnico.pdf");
    });
});
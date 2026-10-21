import { Router } from 'express';

const router = Router();

router.get('/total/:cantidad/:precio', (req, res) => {
  const cantidad = Number(req.params.cantidad);
  const precio = Number(req.params.precio);

  if (isNaN(cantidad) || isNaN(precio)) {
    return res.status(400).json({ error: 'Cantidad y precio deben ser números' });
  }

  const subtotal = cantidad * precio;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  res.json({ subtotal, iva, total });
});

router.get('/descuento/:compra/:codigo', (req, res) => {
  const compra = Number(req.params.compra);
  const codigo = req.params.codigo;

  if (isNaN(compra) || compra <= 0) {
    return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
  }

  let porcentaje;
  if (codigo === 'VERANO10') {
    porcentaje = 0.10;
  } else if (codigo === 'MITAD') {
    porcentaje = 0.50;
  } else {
    return res.status(400).json({ error: 'Código inválido' });
  }

  let montoFinal = compra - compra * porcentaje;

  // 5% adicional si el monto, ya con el descuento del código, supera 1000
  if (montoFinal > 1000) {
    montoFinal = montoFinal * 0.95;
  }

    const descuentoAplicado = compra - montoFinal;

  res.json({ codigo, descuentoAplicado, montoFinal });
});

function calcularPromedio(calificaciones) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(calificaciones) || calificaciones.length < 3) {
      return reject(new Error('calificaciones debe ser un arreglo con al menos 3 elementos'));
    }

    if (!calificaciones.every((c) => typeof c === 'number' && !isNaN(c))) {
      return reject(new Error('Todas las calificaciones deben ser números'));
    }

    const suma = calificaciones.reduce((acc, c) => acc + c, 0);
    const promedio = suma / calificaciones.length;

    let nivel;
    if (promedio >= 8) {
      nivel = 'excelente';
    } else if (promedio >= 6) {
      nivel = 'aceptable';
    } else {
      nivel = 'reprobado';
    }

    resolve({ promedio: Number(promedio.toFixed(2)), nivel });
  });
}

router.post('/promedio', (req, res) => {
  calcularPromedio(req.body.calificaciones)
    .then((resultado) => res.json(resultado))
    .catch((error) => res.status(400).json({ error: error.message }));
});

export default router;
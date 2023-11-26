import { Component } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css'],
})
export class CalculadoraComponent {
  title = 'CalculadoraSubneting';
  ip = '';
  mask = '';
  mascaraSubred = '';
  subnet = '';
  startIP = '';
  endIP = '';
  classType = '';
  publicPrivate = '';
  mensaje = '';
  
  calcularSubnet(): void {
    // Validar la entrada de IP
    const ipParts: number[] = this.ip.split('.').map(Number);
    if (ipParts.some((part) => isNaN(part) || part < 0 || part > 255)) {
      this.mensaje = 'La dirección IP contiene valores inválidos.';
      return;
    }else{
      this.mensaje = 'La dirección IP contiene valores validos.';
    }

    // Obtener la máscara de subred utilizando la nueva función
    this.mascaraSubred = this.obtenerMascaraSubred(this.mask);

    // Fórmula Subred
    const maskParts: number[] = this.mascaraSubred.split('.').map(Number);
    const subnet: number[] = [];
    for (let i = 0; i < 4; i++) {
      subnet[i] = ipParts[i] & maskParts[i];
    }

    // Fórmula Dirección Inicial
    const startIP: number[] = [...subnet];
    startIP[3] += 1;

    // Fórmula Dirección Final
    const inverseMask: number[] = maskParts.map((part) => 255 - part);
    const endIP: number[] = [...subnet];
    for (let i = 0; i < 4; i++) {
      endIP[i] |= inverseMask[i];
    }
    endIP[3] -= 1;

    // Tipo de Clase
    const firstOctet: number = ipParts[0];
    if (firstOctet >= 1 && firstOctet <= 126) {
      this.classType = 'Clase A';
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      this.classType = 'Clase B';
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      this.classType = 'Clase C';
    } else if (firstOctet >= 224 && firstOctet <= 239) {
      this.classType = 'Clase D (Multicast)';
    } else if (firstOctet >= 240 && firstOctet <= 255) {
      this.classType = 'Clase E (Reservada)';
    }

    // Pública o Privada
    this.publicPrivate = this.esPrivada(ipParts) ? 'Privada' : 'Pública';

    // Actualizar los resultados en las variables del componente
    this.subnet = subnet.join('.');
    this.startIP = startIP.join('.');
    this.endIP = endIP.join('.');
  }

  obtenerMascaraSubred(entrada: string): string {
    // Verificar si la entrada es un prefijo en formato "/30"
    if (entrada.includes('/')) {
      const prefijo: number = parseInt(entrada.split('/')[1], 10);

      // Validar que el prefijo esté en el rango válido
      if (isNaN(prefijo) || prefijo <= 0 || prefijo > 32) {
        return this.mensaje = 'Prefijo inválido';
      }

      // Calcular la máscara a partir del prefijo
      const mascara: number[] = Array(4).fill(0);
      for (let i = 0; i < prefijo; i++) {
        mascara[Math.floor(i / 8)] += 1 << (7 - (i % 8));
      }
      return mascara.join('.');
    } else {
      // Si la entrada no tiene '/', se asume que es la dirección directa de la máscara
      return entrada;
    }
  }

  esPrivada(ipParts: number[]): boolean {
    if (ipParts[0] === 10) {
      return true;
    } else if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) {
      return true;
    } else if (ipParts[0] === 192 && ipParts[1] === 168) {
      return true;
    } else {
      return false;
    }
  }
}

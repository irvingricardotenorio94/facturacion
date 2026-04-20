export class CryptoService {
  private static readonly algorithm = { name: 'AES-GCM', length: 256 };

  private static async getCryptoKey(secretKey: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));
    
    return crypto.subtle.importKey(
      'raw',
      keyData,
      this.algorithm,
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(password: string, secretKey: string): Promise<string> {
    if (!password || !secretKey) throw new Error("Datos de cifrado incompletos");

    const key = await this.getCryptoKey(secretKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(password)
    );

    const encryptedArray = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedBase64: string, secretKey: string): Promise<string> {
    if (!encryptedBase64 || !secretKey) throw new Error("Datos de descifrado incompletos");

    const key = await this.getCryptoKey(secretKey);
    const combined = new Uint8Array(
      atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decryptedBuffer);
  }
}
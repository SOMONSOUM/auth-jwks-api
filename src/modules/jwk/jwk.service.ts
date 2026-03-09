import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateKeyPair, exportJWK } from 'jose';
import { randomUUID } from 'crypto';

@Injectable()
export class JwkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { privateKey, publicKey } = await generateKeyPair('RS256');
    const publicJwk = await exportJWK(publicKey);
    const privateJwk = await exportJWK(privateKey);

    const kid = randomUUID();

    return this.prisma.jwk.create({
      data: {
        kid,
        privateKey: {
          ...privateJwk,
          use: 'sig',
          alg: 'RS256',
          kid,
        },
        publicKey: {
          ...publicJwk,
          use: 'sig',
          alg: 'RS256',
          kid,
        },
        algorithm: 'RS256',
        status: 'ACTIVE',
      },
    });
  }
}


/**
 * NestJS-like CLI
 * ----------------
 * Commands supported:
 *  nest new <app>
 *  nest g module <name>
 *  nest g controller <name>
 *  nest g service <name>
 *  nest g provider <name>
 *  nest g guard <name>
 *  nest g interceptor <name>
 *  nest g pipe <name>
 *  nest g filter <name>
 *  nest g dto <name>
 *  nest g resource <name>
 */
import { generate } from './lib/generate';

const [, , cmd, type, name] = process.argv;
generate(cmd, type, name);

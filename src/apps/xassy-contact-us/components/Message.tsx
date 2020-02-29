/**
 * @packageDocumentation
 * @module app/xassy-contact-us
 * 
 */

 // Boilerplate
import { stringInputProvider } from "../../../modules/components/inputProvider";


export const [Message, message$, isValid$, update] = stringInputProvider('message')


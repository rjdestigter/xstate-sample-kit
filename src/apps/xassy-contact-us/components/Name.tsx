/**
 * @packageDocumentation
 * @module app/xassy-contact-us
 * 
 */

 // Boilerplate
import { stringInputProvider } from "../../../modules/components/inputProvider";


export const [Name, name$, isValid$, update] = stringInputProvider('name', { required: true })


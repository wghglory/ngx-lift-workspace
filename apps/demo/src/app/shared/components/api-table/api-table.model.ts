/** Describes one documented API input, output, or parameter. */
export interface ApiProperty {
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  description: string;
}

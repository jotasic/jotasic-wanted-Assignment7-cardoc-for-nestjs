import {
  ArgumentMetadata,
  Optional,
  ParseArrayOptions,
  ParseArrayPipe,
} from '@nestjs/common';

const VALIDATION_ERROR_MESSAGE = 'Validation failed (array size)';

export class ParseArrayMaxMinLenPipe extends ParseArrayPipe {
  constructor(
    @Optional() options: ParseArrayOptions = {},
    @Optional() private readonly minLength: number = 0,
    @Optional() private readonly maxLength: number = Number.MAX_SAFE_INTEGER,
  ) {
    super(options);

    if (minLength > maxLength) {
      throw new RangeError(
        'The maxLength must be greater then the minLength or equal.',
      );
    }

    if (minLength < 0 || maxLength < 0) {
      throw new RangeError(
        'The maxLength or the minLength must be greater then 0 or equal.',
      );
    }
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const data = await super.transform(value, metadata);

    if (!(data.length >= this.minLength && data.length <= this.maxLength)) {
      throw this.exceptionFactory(VALIDATION_ERROR_MESSAGE);
    }

    return value;
  }
}

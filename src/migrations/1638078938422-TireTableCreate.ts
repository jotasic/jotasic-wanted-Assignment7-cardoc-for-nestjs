import { MigrationInterface, QueryRunner } from 'typeorm';

export class TireTableCreate1638078938422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE tires(
        pk INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        width INTEGER,
        aspect_ratio INTEGER,
        wheel_size INTEGER,
        create_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        is_active boolean DEFAULT true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tires`);
  }
}

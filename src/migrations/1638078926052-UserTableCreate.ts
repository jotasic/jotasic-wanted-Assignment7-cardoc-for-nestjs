import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTableCreate1638078926052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE  users ( 
        pk INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        id VARCHAR(20) NOT NULL,
        password VARCHAR(250) NOT NULL,
        create_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        is_active boolean DEFAULT true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}

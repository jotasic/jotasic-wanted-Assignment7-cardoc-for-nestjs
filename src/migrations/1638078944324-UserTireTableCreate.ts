import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTireTableCreate1638078944324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE user_tires(
        pk INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        create_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        is_active boolean DEFAULT true,
        user_pk INTEGER,
        tire_pk INTEGER,
        FOREIGN KEY (user_pk) REFERENCES users(pk),
        FOREIGN KEY (tire_pk) REFERENCES tires(pk))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_tires`);
  }
}

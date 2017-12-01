<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

class Version20171123091014 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE institution (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, INDEX IDX_3A9F98E561220EA6 (creator_id), INDEX IDX_3A9F98E5E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collection (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', description LONGTEXT NOT NULL, is_source TINYINT(1) DEFAULT \'0\' NOT NULL, name VARCHAR(255) NOT NULL, organization VARCHAR(255) DEFAULT \'\' NOT NULL, INDEX IDX_FC4D653261220EA6 (creator_id), INDEX IDX_FC4D6532E37ECFB0 (updater_id), INDEX IDX_FC4D6532727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collection_image (collection_id INT NOT NULL, image_id INT NOT NULL, INDEX IDX_82C5BC0C514956FD (collection_id), INDEX IDX_82C5BC0C3DA5256D (image_id), PRIMARY KEY(collection_id, image_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, institution_id INT DEFAULT NULL, original_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', filename VARCHAR(2000) NOT NULL, is_public TINYINT(1) DEFAULT \'0\' NOT NULL, dating VARCHAR(255) DEFAULT \'\' NOT NULL, dating_from DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', dating_to DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type ENUM(\'default\', \'image\', \'architecture\') DEFAULT \'default\' NOT NULL COMMENT \'(DC2Type:ImageType)\', status ENUM(\'new\', \'edited\', \'reviewed\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:ImageStatus)\', addition VARCHAR(255) DEFAULT \'\' NOT NULL, expanded_name VARCHAR(255) DEFAULT \'\' NOT NULL, material VARCHAR(255) DEFAULT \'\' NOT NULL, technique VARCHAR(255) DEFAULT \'\' NOT NULL, technique_author VARCHAR(255) DEFAULT \'\' NOT NULL, format VARCHAR(255) DEFAULT \'\' NOT NULL, literature VARCHAR(255) DEFAULT \'\' NOT NULL, page VARCHAR(10) DEFAULT \'\' NOT NULL, figure VARCHAR(10) DEFAULT \'\' NOT NULL, `table` VARCHAR(10) DEFAULT \'\' NOT NULL, isbn VARCHAR(20) DEFAULT \'\' NOT NULL, comment LONGTEXT NOT NULL, rights VARCHAR(255) DEFAULT \'\' NOT NULL, museris_url VARCHAR(255) DEFAULT \'\' NOT NULL, museris_cote VARCHAR(255) DEFAULT \'\' NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_C53D045F61220EA6 (creator_id), INDEX IDX_C53D045FE37ECFB0 (updater_id), INDEX IDX_C53D045F10405986 (institution_id), INDEX IDX_C53D045F108B7592 (original_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image_artist (image_id INT NOT NULL, artist_id INT NOT NULL, INDEX IDX_AE44C84F3DA5256D (image_id), INDEX IDX_AE44C84FB7970CF8 (artist_id), PRIMARY KEY(image_id, artist_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image_tag (image_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_5B6367D03DA5256D (image_id), INDEX IDX_5B6367D0BAD26311 (tag_id), PRIMARY KEY(image_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE artist (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, INDEX IDX_159968761220EA6 (creator_id), INDEX IDX_1599687E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, INDEX IDX_389B78361220EA6 (creator_id), INDEX IDX_389B783E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', login VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(191) NOT NULL, is_administrator TINYINT(1) NOT NULL, active_until DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', terms_agreement DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type ENUM(\'default\', \'unil\') DEFAULT \'default\' NOT NULL COMMENT \'(DC2Type:UserType)\', organization VARCHAR(255) DEFAULT \'\' NOT NULL, UNIQUE INDEX UNIQ_8D93D649AA08CB10 (login), INDEX IDX_8D93D64961220EA6 (creator_id), INDEX IDX_8D93D649E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `change` (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, original_id INT DEFAULT NULL, suggestion_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type ENUM(\'create\', \'update\', \'delete\') DEFAULT \'update\' NOT NULL COMMENT \'(DC2Type:ChangeType)\', status ENUM(\'new\', \'accepted\', \'rejected\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:ChangeStatus)\', response_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', request LONGTEXT NOT NULL, response LONGTEXT NOT NULL, INDEX IDX_4057FE2061220EA6 (creator_id), INDEX IDX_4057FE20E37ECFB0 (updater_id), INDEX IDX_4057FE20108B7592 (original_id), INDEX IDX_4057FE20A41BB822 (suggestion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D653261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D6532E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D6532727ACA70 FOREIGN KEY (parent_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_image ADD CONSTRAINT FK_82C5BC0C514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_image ADD CONSTRAINT FK_82C5BC0C3DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F10405986 FOREIGN KEY (institution_id) REFERENCES institution (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F108B7592 FOREIGN KEY (original_id) REFERENCES image (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE image_artist ADD CONSTRAINT FK_AE44C84F3DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image_artist ADD CONSTRAINT FK_AE44C84FB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image_tag ADD CONSTRAINT FK_5B6367D03DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image_tag ADD CONSTRAINT FK_5B6367D0BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_159968761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_1599687E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B78361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B783E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE2061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20108B7592 FOREIGN KEY (original_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20A41BB822 FOREIGN KEY (suggestion_id) REFERENCES image (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        $this->throwIrreversibleMigrationException();
    }
}

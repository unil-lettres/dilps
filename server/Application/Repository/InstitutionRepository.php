<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Institution;

class InstitutionRepository extends AbstractRepository
{
    /**
     * Get or create an institution by its name
     *
     * @param null|string $name
     * @param string $site
     *
     * @return Institution
     */
    public function getOrCreateByName(?string $name, string $site): ?Institution
    {
        $name = trim($name ?? '');

        if (!$name) {
            return null;
        }

        $institution = $this->findOneBy([
            'name' => $name,
            'site' => $site,
        ]);

        if (!$institution) {
            $institution = new Institution();
            $this->getEntityManager()->persist($institution);
            $institution->setName($name);
            $institution->setSite($site);
        }

        return $institution;
    }
}

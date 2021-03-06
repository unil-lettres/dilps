<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasSite;
use Application\Traits\HasSiteInterface;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasName;

/**
 * An artist
 *
 * @ORM\Entity(repositoryClass="Application\Repository\ArtistRepository")
 * @ORM\Table(uniqueConstraints={
 *     @ORM\UniqueConstraint(name="unique_name", columns={"name"})
 * })
 */
class Artist extends AbstractModel implements HasSiteInterface
{
    use HasName;
    use HasSite;
}

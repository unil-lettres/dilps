<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Card;
use Application\Model\Change;
use Application\Model\User;

class ChangeRepository extends AbstractRepository implements \Ecodev\Felix\Repository\LimitedAccessSubQuery
{
    /**
     * Get an open change for the given suggestion
     */
    public function getOrCreate(string $type, Card $card, string $request, string $site): Change
    {
        $criteria = [
            'type' => $type,
            'site' => $site,
        ];

        if ($type === Change::TYPE_DELETE) {
            $criteria['original'] = $card;
            $original = $card;
            $suggestion = null;
        } else {
            $criteria['suggestion'] = $card;
            $original = $card->getOriginal();
            $suggestion = $card;
        }

        $change = $this->findOneBy($criteria);

        if (!$change) {

            // Create the change
            $change = new Change();
            _em()->persist($change);
            $change->setSite($site);
            $change->setSuggestion($suggestion);
            $change->setOriginal($original);
            $change->setType($type);
            $change->setRequest($request);
        }

        return $change;
    }

    /**
     * Returns pure SQL to get ID of all changes that are accessible to given user.
     *
     * A change is accessible if:
     *
     * - change owner or creator is the user
     */
    public function getAccessibleSubQuery(?\Ecodev\Felix\Model\User $user): string
    {
        if ($user && $user->getRole() === User::ROLE_ADMINISTRATOR) {
            return '';
        }

        if ($user) {
            $userId = $this->getEntityManager()->getConnection()->quote($user->getId());
            $qb = $this->getEntityManager()->getConnection()->createQueryBuilder()
                ->select('`change`.id')
                ->from('`change`')
                ->where('`change`.owner_id = ' . $userId . ' OR `change`.creator_id = ' . $userId);
        } else {
            return '-1';
        }

        return $qb->getSQL();
    }
}

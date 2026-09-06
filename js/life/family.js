/* ============================================================
   MMA LIFE DYNASTY
   LIFE — FAMILY
   Sistema de estrutura familiar e parentesco
   ============================================================ */

const FAMILY_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

const FAMILY_RELATION_TYPES = {
  SELF: "self",

  FATHER: "father",
  MOTHER: "mother",
  PARENT: "parent",

  SON: "son",
  DAUGHTER: "daughter",
  CHILD: "child",

  BROTHER: "brother",
  SISTER: "sister",
  SIBLING: "sibling",

  GRANDFATHER: "grandfather",
  GRANDMOTHER: "grandmother",
  GRANDPARENT: "grandparent",

  GRANDSON: "grandson",
  GRANDDAUGHTER: "granddaughter",
  GRANDCHILD: "grandchild",

  UNCLE: "uncle",
  AUNT: "aunt",
  UNCLE_AUNT: "uncle_aunt",

  NEPHEW: "nephew",
  NIECE: "niece",
  NEPHEW_NIECE: "nephew_niece",

  COUSIN: "cousin",

  PARTNER: "partner",
  SPOUSE: "spouse",
  EX_SPOUSE: "ex_spouse",

  IN_LAW: "in_law",

  STEP_PARENT: "step_parent",
  STEP_CHILD: "step_child",
  STEP_SIBLING: "step_sibling"
};

const FAMILY_MEMBER_TYPES = {
  PLAYER: "player",
  NPC: "npc",
  CHILD: "child",
  SPOUSE: "spouse",
  PARENT: "parent",
  SIBLING: "sibling",
  GRANDPARENT: "grandparent",
  RELATIVE: "relative"
};

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return String(value).trim();
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}

function generateId(prefix = "family") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   NOMES DE PARENTESCO
   ============================================================ */

function getRelationLabel(type) {
  const labels = {
    self: "Você",

    father: "Pai",
    mother: "Mãe",
    parent: "Pai/Mãe",

    son: "Filho",
    daughter: "Filha",
    child: "Filho(a)",

    brother: "Irmão",
    sister: "Irmã",
    sibling: "Irmão/Irmã",

    grandfather: "Avô",
    grandmother: "Avó",
    grandparent: "Avô/Avó",

    grandson: "Neto",
    granddaughter: "Neta",
    grandchild: "Neto(a)",

    uncle: "Tio",
    aunt: "Tia",
    uncle_aunt: "Tio/Tia",

    nephew: "Sobrinho",
    niece: "Sobrinha",
    nephew_niece: "Sobrinho(a)",

    cousin: "Primo(a)",

    partner: "Parceiro(a)",
    spouse: "Cônjuge",
    ex_spouse: "Ex-cônjuge",

    in_law: "Parente por casamento",

    step_parent: "Padrasto/Madrasta",
    step_child: "Enteado(a)",
    step_sibling: "Meio-irmão/Irmã"
  };

  return labels[type] || "Parente";
}

/* ============================================================
   CRIAÇÃO DE MEMBRO FAMILIAR
   ============================================================ */

function createFamilyMember(data = {}) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("family_member"),

    entityId:
      normalizeId(
        data.entityId ||
        data.characterId ||
        data.personId
      ),

    type:
      data.type ||
      FAMILY_MEMBER_TYPES.RELATIVE,

    name:
      data.name ||
      "Familiar",

    gender:
      data.gender ||
      null,

    age:
      Number.isFinite(
        Number(data.age)
      )
        ? Number(data.age)
        : null,

    alive:
      data.alive !== false,

    countryId:
      data.countryId || null,

    cityId:
      data.cityId || null,

    relation:
      data.relation ||
      FAMILY_RELATION_TYPES.RELATIVE,

    relationLabel:
      data.relationLabel ||
      getRelationLabel(
        data.relation ||
        FAMILY_RELATION_TYPES.RELATIVE
      ),

    relationshipScore:
      clamp(
        Number(
          data.relationshipScore ??
            randomInt(50, 90)
        ),
        -100,
        100
      ),

    notes:
      data.notes || "",

    metadata:
      data.metadata
        ? clone(data.metadata)
        : {}
  };
}

/* ============================================================
   ESTADO
   ============================================================ */

function ensureFamilyState(database) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.family) {
    database.life.family = {};
  }

  const family =
    database.life.family;

  if (!family.members) {
    family.members = {};
  }

  if (!Array.isArray(family.relationships)) {
    family.relationships = [];
  }

  if (!Array.isArray(family.history)) {
    family.history = [];
  }

  if (!Array.isArray(family.familyUnits)) {
    family.familyUnits = [];
  }

  if (!family.tree) {
    family.tree = {
      rootId: null,
      nodes: {},
      generations: {}
    };
  }

  if (!family.stats) {
    family.stats = {
      totalMembers: 0,
      livingMembers: 0,
      generations: 0
    };
  }

  return family;
}

/* ============================================================
   MEMBROS
   ============================================================ */

function addFamilyMember(
  database,
  data = {}
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const member =
    createFamilyMember(data);

  family.members[member.id] =
    member;

  updateFamilyStats(database);

  return clone(member);
}

function getFamilyMember(
  database,
  memberId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(memberId);

  const member =
    family.members[id];

  return member
    ? clone(member)
    : null;
}

function findFamilyMemberReference(
  database,
  memberId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(memberId);

  return (
    family.members[id] ||
    null
  );
}

function getAllFamilyMembers(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  return Object.values(
    family.members
  ).map(clone);
}

function updateFamilyMember(
  database,
  memberId,
  updates = {}
) {
  const member =
    findFamilyMemberReference(
      database,
      memberId
    );

  if (!member) {
    return null;
  }

  Object.keys(updates).forEach(
    key => {
      if (
        key !== "id" &&
        updates[key] !== undefined
      ) {
        member[key] =
          clone(updates[key]);
      }
    }
  );

  updateFamilyStats(database);

  return clone(member);
}

function removeFamilyMember(
  database,
  memberId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return false;
  }

  const id =
    normalizeId(memberId);

  if (!family.members[id]) {
    return false;
  }

  delete family.members[id];

  family.relationships =
    family.relationships.filter(
      relationship =>
        relationship.fromId !== id &&
        relationship.toId !== id
    );

  updateFamilyStats(database);

  return true;
}

/* ============================================================
   RELACIONAMENTOS FAMILIARES
   ============================================================ */

function createFamilyRelationship(
  data = {}
) {
  const fromId =
    normalizeId(
      data.fromId ||
      data.sourceId
    );

  const toId =
    normalizeId(
      data.toId ||
      data.targetId
    );

  return {
    id:
      normalizeId(data.id) ||
      generateId("family_rel"),

    fromId,

    toId,

    type:
      data.type ||
      FAMILY_RELATION_TYPES.RELATIVE,

    label:
      data.label ||
      getRelationLabel(
        data.type ||
        FAMILY_RELATION_TYPES.RELATIVE
      ),

    score:
      clamp(
        Number(
          data.score ?? 70
        ),
        -100,
        100
      ),

    biological:
      data.biological !== false,

    legal:
      data.legal !== false,

    active:
      data.active !== false,

    createdAt:
      data.createdAt ||
      new Date().toISOString(),

    metadata:
      data.metadata
        ? clone(data.metadata)
        : {}
  };
}

function addFamilyRelationship(
  database,
  data = {}
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  if (
    !data.fromId ||
    !data.toId
  ) {
    return null;
  }

  const relationship =
    createFamilyRelationship(
      data
    );

  family.relationships.push(
    relationship
  );

  return clone(
    relationship
  );
}

function getFamilyRelationship(
  database,
  relationshipId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(
      relationshipId
    );

  const relationship =
    family.relationships.find(
      item =>
        normalizeId(item.id) === id
    );

  return relationship
    ? clone(relationship)
    : null;
}

function findFamilyRelationshipReference(
  database,
  relationshipId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(
      relationshipId
    );

  return (
    family.relationships.find(
      item =>
        normalizeId(item.id) === id
    ) || null
  );
}

function getFamilyRelationships(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  return family.relationships.map(
    clone
  );
}

function updateFamilyRelationship(
  database,
  relationshipId,
  updates = {}
) {
  const relationship =
    findFamilyRelationshipReference(
      database,
      relationshipId
    );

  if (!relationship) {
    return null;
  }

  Object.keys(updates).forEach(
    key => {
      if (
        key !== "id" &&
        updates[key] !== undefined
      ) {
        relationship[key] =
          clone(updates[key]);
      }
    }
  );

  return clone(
    relationship
  );
}

function removeFamilyRelationship(
  database,
  relationshipId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return false;
  }

  const id =
    normalizeId(
      relationshipId
    );

  const index =
    family.relationships.findIndex(
      item =>
        normalizeId(item.id) === id
    );

  if (index === -1) {
    return false;
  }

  family.relationships.splice(
    index,
    1
  );

  return true;
}

/* ============================================================
   CONEXÕES DIRETAS
   ============================================================ */

function connectFamilyMembers(
  database,
  fromId,
  toId,
  type,
  options = {}
) {
  if (
    !fromId ||
    !toId ||
    normalizeId(fromId) ===
      normalizeId(toId)
  ) {
    return null;
  }

  const relationship =
    addFamilyRelationship(
      database,
      {
        fromId,
        toId,
        type,
        biological:
          options.biological !== false,
        legal:
          options.legal !== false,
        score:
          options.score ??
          70
      }
    );

  return relationship;
}

function disconnectFamilyMembers(
  database,
  fromId,
  toId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return 0;
  }

  const from =
    normalizeId(fromId);

  const to =
    normalizeId(toId);

  const before =
    family.relationships.length;

  family.relationships =
    family.relationships.filter(
      relationship =>
        !(
          normalizeId(
            relationship.fromId
          ) === from &&
          normalizeId(
            relationship.toId
          ) === to
        )
    );

  return (
    before -
    family.relationships.length
  );
}

/* ============================================================
   PARENTES
   ============================================================ */

function setParents(
  database,
  childId,
  fatherId = null,
  motherId = null
) {
  if (!childId) {
    return false;
  }

  if (fatherId) {
    connectFamilyMembers(
      database,
      fatherId,
      childId,
      FAMILY_RELATION_TYPES.SON
    );

    connectFamilyMembers(
      database,
      childId,
      fatherId,
      FAMILY_RELATION_TYPES.FATHER
    );
  }

  if (motherId) {
    connectFamilyMembers(
      database,
      motherId,
      childId,
      FAMILY_RELATION_TYPES.DAUGHTER
    );

    connectFamilyMembers(
      database,
      childId,
      motherId,
      FAMILY_RELATION_TYPES.MOTHER
    );
  }

  return true;
}

function getParents(
  database,
  childId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  const id =
    normalizeId(childId);

  const parentTypes = [
    FAMILY_RELATION_TYPES.FATHER,
    FAMILY_RELATION_TYPES.MOTHER,
    FAMILY_RELATION_TYPES.PARENT
  ];

  return family.relationships
    .filter(
      relationship =>
        normalizeId(
          relationship.fromId
        ) === id &&
        parentTypes.includes(
          relationship.type
        )
    )
    .map(
      relationship =>
        getFamilyMember(
          database,
          relationship.toId
        )
    )
    .filter(Boolean);
}

function getChildren(
  database,
  parentId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  const id =
    normalizeId(parentId);

  const childTypes = [
    FAMILY_RELATION_TYPES.SON,
    FAMILY_RELATION_TYPES.DAUGHTER,
    FAMILY_RELATION_TYPES.CHILD
  ];

  return family.relationships
    .filter(
      relationship =>
        normalizeId(
          relationship.fromId
        ) === id &&
        childTypes.includes(
          relationship.type
        )
    )
    .map(
      relationship =>
        getFamilyMember(
          database,
          relationship.toId
        )
    )
    .filter(Boolean);
}

function getSiblings(
  database,
  memberId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  const id =
    normalizeId(memberId);

  const parents =
    getParents(
      database,
      id
    );

  if (parents.length === 0) {
    return [];
  }

  const siblingMap =
    new Map();

  parents.forEach(parent => {
    const children =
      getChildren(
        database,
        parent.id
      );

    children.forEach(child => {
      if (
        normalizeId(child.id) !==
        id
      ) {
        siblingMap.set(
          child.id,
          child
        );
      }
    });
  });

  return Array.from(
    siblingMap.values()
  );
}

/* ============================================================
   AVÓS E NETOS
   ============================================================ */

function getGrandparents(
  database,
  memberId
) {
  const parents =
    getParents(
      database,
      memberId
    );

  const grandparents =
    new Map();

  parents.forEach(parent => {
    const parentParents =
      getParents(
        database,
        parent.id
      );

    parentParents.forEach(
      grandparent => {
        grandparents.set(
          grandparent.id,
          grandparent
        );
      }
    );
  });

  return Array.from(
    grandparents.values()
  );
}

function getGrandchildren(
  database,
  memberId
) {
  const children =
    getChildren(
      database,
      memberId
    );

  const grandchildren =
    new Map();

  children.forEach(child => {
    const childChildren =
      getChildren(
        database,
        child.id
      );

    childChildren.forEach(
      grandchild => {
        grandchildren.set(
          grandchild.id,
          grandchild
        );
      }
    );
  });

  return Array.from(
    grandchildren.values()
  );
}

/* ============================================================
   PARENTESCO GENÉRICO
   ============================================================ */

function getFamilyOfMember(
  database,
  memberId
) {
  return {
    parents:
      getParents(
        database,
        memberId
      ),

    siblings:
      getSiblings(
        database,
        memberId
      ),

    children:
      getChildren(
        database,
        memberId
      ),

    grandparents:
      getGrandparents(
        database,
        memberId
      ),

    grandchildren:
      getGrandchildren(
        database,
        memberId
      )
  };
}

/* ============================================================
   CÔNJUGE / PARCEIRO
   ============================================================ */

function connectSpouses(
  database,
  memberAId,
  memberBId,
  options = {}
) {
  if (
    !memberAId ||
    !memberBId
  ) {
    return false;
  }

  connectFamilyMembers(
    database,
    memberAId,
    memberBId,
    FAMILY_RELATION_TYPES.SPOUSE,
    options
  );

  connectFamilyMembers(
    database,
    memberBId,
    memberAId,
    FAMILY_RELATION_TYPES.SPOUSE,
    options
  );

  return true;
}

function disconnectSpouses(
  database,
  memberAId,
  memberBId
) {
  disconnectFamilyMembers(
    database,
    memberAId,
    memberBId
  );

  disconnectFamilyMembers(
    database,
    memberBId,
    memberAId
  );

  return true;
}

function getSpouse(
  database,
  memberId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(memberId);

  const relationship =
    family.relationships.find(
      item =>
        normalizeId(
          item.fromId
        ) === id &&
        (
          item.type ===
            FAMILY_RELATION_TYPES.SPOUSE ||
          item.type ===
            FAMILY_RELATION_TYPES.PARTNER
        ) &&
        item.active !== false
    );

  if (!relationship) {
    return null;
  }

  return getFamilyMember(
    database,
    relationship.toId
  );
}

/* ============================================================
   GERAÇÕES
   ============================================================ */

function calculateGeneration(
  database,
  memberId,
  visited = new Set()
) {
  const id =
    normalizeId(memberId);

  if (!id) {
    return 0;
  }

  if (visited.has(id)) {
    return 0;
  }

  visited.add(id);

  const parents =
    getParents(
      database,
      id
    );

  if (parents.length === 0) {
    return 0;
  }

  const parentGenerations =
    parents.map(parent =>
      calculateGeneration(
        database,
        parent.id,
        new Set(visited)
      )
    );

  return (
    Math.max(
      ...parentGenerations
    ) + 1
  );
}

function getGenerationMembers(
  database,
  generation
) {
  const members =
    getAllFamilyMembers(
      database
    );

  return members.filter(
    member =>
      calculateGeneration(
        database,
        member.id
      ) === Number(generation)
  );
}

function calculateGenerations(
  database
) {
  const members =
    getAllFamilyMembers(
      database
    );

  const generations = {};

  members.forEach(member => {
    const generation =
      calculateGeneration(
        database,
        member.id
      );

    if (!generations[generation]) {
      generations[generation] =
        [];
    }

    generations[generation].push(
      clone(member)
    );
  });

  return generations;
}

/* ============================================================
   ÁRVORE FAMILIAR
   ============================================================ */

function buildFamilyTree(
  database,
  rootId
) {
  const root =
    getFamilyMember(
      database,
      rootId
    );

  if (!root) {
    return null;
  }

  const visited =
    new Set();

  function buildNode(memberId) {
    const id =
      normalizeId(memberId);

    if (visited.has(id)) {
      return null;
    }

    visited.add(id);

    const member =
      getFamilyMember(
        database,
        id
      );

    if (!member) {
      return null;
    }

    const parents =
      getParents(
        database,
        id
      ).map(parent =>
        buildNode(parent.id)
      ).filter(Boolean);

    const children =
      getChildren(
        database,
        id
      ).map(child =>
        buildNode(child.id)
      ).filter(Boolean);

    return {
      ...member,

      generation:
        calculateGeneration(
          database,
          id
        ),

      parents,

      children
    };
  }

  return buildNode(root.id);
}

function updateFamilyTree(
  database,
  rootId = null
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const selectedRoot =
    rootId ||
    family.tree.rootId;

  if (!selectedRoot) {
    return family.tree;
  }

  const tree =
    buildFamilyTree(
      database,
      selectedRoot
    );

  if (!tree) {
    return family.tree;
  }

  family.tree = {
    rootId:
      normalizeId(selectedRoot),

    nodes: {
      [tree.id]: tree
    },

    generations:
      calculateGenerations(
        database
      )
  };

  return clone(
    family.tree
  );
}

/* ============================================================
   UNIDADES FAMILIARES
   ============================================================ */

function createFamilyUnit(
  database,
  memberIds = [],
  data = {}
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const ids =
    memberIds
      .map(normalizeId)
      .filter(Boolean);

  const unit = {
    id:
      normalizeId(data.id) ||
      generateId("family_unit"),

    name:
      data.name ||
      "Família",

    memberIds: [
      ...new Set(ids)
    ],

    type:
      data.type ||
      "household",

    residence:
      data.residence
        ? clone(data.residence)
        : null,

    wealth:
      Number(data.wealth) || 0,

    reputation:
      clamp(
        Number(
          data.reputation ?? 50
        ),
        0,
        100
      ),

    createdAt:
      new Date().toISOString()
  };

  family.familyUnits.push(
    unit
  );

  return clone(unit);
}

function getFamilyUnits(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  return family.familyUnits.map(
    clone
  );
}

function getFamilyUnit(
  database,
  unitId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(unitId);

  const unit =
    family.familyUnits.find(
      item =>
        normalizeId(item.id) === id
    );

  return unit
    ? clone(unit)
    : null;
}

/* ============================================================
   HISTÓRICO FAMILIAR
   ============================================================ */

function addFamilyHistory(
  database,
  type,
  description,
  data = {}
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const event = {
    id:
      generateId("family_history"),

    type,

    description,

    date:
      new Date().toISOString(),

    data:
      clone(data)
  };

  family.history.push(
    event
  );

  return clone(event);
}

function getFamilyHistory(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return [];
  }

  return family.history.map(
    clone
  );
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function updateFamilyStats(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const members =
    Object.values(
      family.members
    );

  const living =
    members.filter(
      member =>
        member.alive !== false
    );

  const generations =
    calculateGenerations(
      database
    );

  family.stats = {
    totalMembers:
      members.length,

    livingMembers:
      living.length,

    deceasedMembers:
      members.length -
      living.length,

    generations:
      Object.keys(
        generations
      ).length,

    relationships:
      family.relationships.length,

    familyUnits:
      family.familyUnits.length
  };

  return clone(
    family.stats
  );
}

function getFamilyStats(
  database
) {
  return updateFamilyStats(
    database
  );
}

/* ============================================================
   CONSTRUÇÃO AUTOMÁTICA A PARTIR DOS FILHOS
   ============================================================ */

function registerChildInFamily(
  database,
  child
) {
  if (!child) {
    return null;
  }

  const childId =
    normalizeId(
      child.id
    );

  if (!childId) {
    return null;
  }

  const member =
    addFamilyMember(
      database,
      {
        id:
          `family_${childId}`,

        entityId:
          childId,

        type:
          FAMILY_MEMBER_TYPES.CHILD,

        name:
          child.identity?.name ||
          "Filho(a)",

        gender:
          child.identity?.gender ||
          null,

        age:
          child.age ?? 0,

        alive:
          child.life?.alive !== false,

        countryId:
          child.identity?.countryId ||
          null,

        cityId:
          child.identity?.cityId ||
          null,

        relation:
          child.identity?.gender ===
          "female"
            ? FAMILY_RELATION_TYPES.DAUGHTER
            : FAMILY_RELATION_TYPES.SON
      }
    );

  return member;
}

function syncChildrenWithFamily(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return 0;
  }

  const children =
    database.life?.children;

  if (!Array.isArray(children)) {
    return 0;
  }

  let added = 0;

  children.forEach(child => {
    const existing =
      Object.values(
        family.members
      ).find(
        member =>
          normalizeId(
            member.entityId
          ) ===
          normalizeId(child.id)
      );

    if (!existing) {
      registerChildInFamily(
        database,
        child
      );

      added++;
    }
  });

  updateFamilyStats(database);

  return added;
}

/* ============================================================
   SINCRONIZAÇÃO COM RELACIONAMENTOS
   ============================================================ */

function syncFamilyRelationships(
  database
) {
  const children =
    database.life?.children;

  if (
    !Array.isArray(children)
  ) {
    return 0;
  }

  let connections = 0;

  children.forEach(child => {
    const childFamilyMember =
      Object.values(
        ensureFamilyState(
          database
        ).members
      ).find(
        member =>
          normalizeId(
            member.entityId
          ) ===
          normalizeId(child.id)
      );

    if (!childFamilyMember) {
      return;
    }

    const fatherId =
      normalizeId(
        child.parents?.fatherId
      );

    const motherId =
      normalizeId(
        child.parents?.motherId
      );

    if (fatherId) {
      const father =
        findFamilyMemberByEntityId(
          database,
          fatherId
        );

      if (father) {
        connectFamilyMembers(
          database,
          father.id,
          childFamilyMember.id,
          FAMILY_RELATION_TYPES.SON
        );

        connectFamilyMembers(
          database,
          childFamilyMember.id,
          father.id,
          FAMILY_RELATION_TYPES.FATHER
        );

        connections++;
      }
    }

    if (motherId) {
      const mother =
        findFamilyMemberByEntityId(
          database,
          motherId
        );

      if (mother) {
        connectFamilyMembers(
          database,
          mother.id,
          childFamilyMember.id,
          FAMILY_RELATION_TYPES.DAUGHTER
        );

        connectFamilyMembers(
          database,
          childFamilyMember.id,
          mother.id,
          FAMILY_RELATION_TYPES.MOTHER
        );

        connections++;
      }
    }
  });

  return connections;
}

function findFamilyMemberByEntityId(
  database,
  entityId
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  const id =
    normalizeId(entityId);

  return (
    Object.values(
      family.members
    ).find(
      member =>
        normalizeId(
          member.entityId
        ) === id
    ) || null
  );
}

/* ============================================================
   PERSONAGEM PRINCIPAL
   ============================================================ */

function registerPlayerInFamily(
  database,
  player
) {
  const family =
    ensureFamilyState(database);

  if (!family || !player) {
    return null;
  }

  const playerId =
    normalizeId(
      player.id ||
      player.playerId
    );

  if (!playerId) {
    return null;
  }

  const existing =
    findFamilyMemberByEntityId(
      database,
      playerId
    );

  if (existing) {
    family.tree.rootId =
      existing.id;

    return clone(existing);
  }

  const member =
    addFamilyMember(
      database,
      {
        id:
          `family_player_${playerId}`,

        entityId:
          playerId,

        type:
          FAMILY_MEMBER_TYPES.PLAYER,

        name:
          player.name ||
          player.identity?.name ||
          "Personagem",

        gender:
          player.gender ||
          player.identity?.gender ||
          null,

        age:
          player.age ??
          player.identity?.age ??
          18,

        alive:
          player.alive !== false,

        countryId:
          player.countryId ||
          player.identity?.countryId ||
          null,

        cityId:
          player.cityId ||
          player.identity?.cityId ||
          null,

        relation:
          FAMILY_RELATION_TYPES.SELF,

        relationshipScore:
          100
      }
    );

  family.tree.rootId =
    member.id;

  return member;
}

/* ============================================================
   ATUALIZAÇÃO DE IDADE
   ============================================================ */

function ageFamilyMembers(
  database,
  years = 1
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return 0;
  }

  const amount =
    Math.max(
      0,
      Number(years) || 0
    );

  let updated = 0;

  Object.values(
    family.members
  ).forEach(member => {
    if (
      Number.isFinite(
        Number(member.age)
      )
    ) {
      member.age += amount;
      updated++;
    }
  });

  return updated;
}

/* ============================================================
   MORTE DE FAMILIAR
   ============================================================ */

function markFamilyMemberDead(
  database,
  memberId,
  reason = "natural"
) {
  const member =
    findFamilyMemberReference(
      database,
      memberId
    );

  if (!member) {
    return false;
  }

  member.alive = false;

  addFamilyHistory(
    database,
    "death",
    `${member.name} faleceu.`,
    {
      memberId:
        member.id,

      reason
    }
  );

  return true;
}

/* ============================================================
   BUSCA
   ============================================================ */

function searchFamilyMembers(
  database,
  query
) {
  const members =
    getAllFamilyMembers(
      database
    );

  const term =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();

  if (!term) {
    return members;
  }

  return members.filter(
    member =>
      String(
        member.name || ""
      )
        .toLowerCase()
        .includes(term) ||

      String(
        member.relationLabel || ""
      )
        .toLowerCase()
        .includes(term)
  );
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getFamilySnapshot(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  updateFamilyStats(database);

  return {
    version:
      FAMILY_VERSION,

    stats:
      clone(family.stats),

    members:
      getAllFamilyMembers(
        database
      ),

    relationships:
      getFamilyRelationships(
        database
      ),

    units:
      getFamilyUnits(
        database
      ),

    rootId:
      family.tree.rootId,

    generations:
      calculateGenerations(
        database
      )
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateFamilyMember(
  member
) {
  const errors = [];

  if (!member?.id) {
    errors.push(
      "Membro sem ID."
    );
  }

  if (!member?.name) {
    errors.push(
      "Membro sem nome."
    );
  }

  if (!member?.relation) {
    errors.push(
      "Membro sem parentesco."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

function validateFamily(
  database
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return {
      valid: false,
      errors: [
        "Estado familiar inexistente."
      ]
    };
  }

  const memberResults =
    Object.values(
      family.members
    ).map(member => ({
      id: member.id,
      ...validateFamilyMember(
        member
      )
    }));

  const relationshipErrors =
    [];

  family.relationships.forEach(
    relationship => {
      if (
        !family.members[
          relationship.fromId
        ]
      ) {
        relationshipErrors.push(
          `Origem inexistente: ${relationship.fromId}`
        );
      }

      if (
        !family.members[
          relationship.toId
        ]
      ) {
        relationshipErrors.push(
          `Destino inexistente: ${relationship.toId}`
        );
      }
    }
  );

  return {
    valid:
      memberResults.every(
        result =>
          result.valid
      ) &&
      relationshipErrors.length ===
        0,

    members:
      memberResults,

    relationshipErrors
  };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeFamily(
  database,
  player = null
) {
  const family =
    ensureFamilyState(database);

  if (!family) {
    return null;
  }

  if (player) {
    registerPlayerInFamily(
      database,
      player
    );
  }

  syncChildrenWithFamily(
    database
  );

  syncFamilyRelationships(
    database
  );

  updateFamilyStats(
    database
  );

  if (family.tree.rootId) {
    updateFamilyTree(
      database,
      family.tree.rootId
    );
  }

  return clone(family);
}

/* ============================================================
   RESET
   ============================================================ */

function resetFamily(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.family = {
    members: {},
    relationships: [],
    history: [],
    familyUnits: [],
    tree: {
      rootId: null,
      nodes: {},
      generations: {}
    },
    stats: {
      totalMembers: 0,
      livingMembers: 0,
      deceasedMembers: 0,
      generations: 0,
      relationships: 0,
      familyUnits: 0
    }
  };

  return database.life.family;
}

/* ============================================================
   API
   ============================================================ */

const familyAPI = {
  FAMILY_VERSION,

  FAMILY_RELATION_TYPES,
  FAMILY_MEMBER_TYPES,

  getRelationLabel,

  createFamilyMember,

  ensureFamilyState,

  addFamilyMember,
  getFamilyMember,
  findFamilyMemberReference,
  getAllFamilyMembers,
  updateFamilyMember,
  removeFamilyMember,

  createFamilyRelationship,
  addFamilyRelationship,
  getFamilyRelationship,
  findFamilyRelationshipReference,
  getFamilyRelationships,
  updateFamilyRelationship,
  removeFamilyRelationship,

  connectFamilyMembers,
  disconnectFamilyMembers,

  setParents,
  getParents,
  getChildren,
  getSiblings,

  getGrandparents,
  getGrandchildren,

  getFamilyOfMember,

  connectSpouses,
  disconnectSpouses,
  getSpouse,

  calculateGeneration,
  getGenerationMembers,
  calculateGenerations,

  buildFamilyTree,
  updateFamilyTree,

  createFamilyUnit,
  getFamilyUnits,
  getFamilyUnit,

  addFamilyHistory,
  getFamilyHistory,

  updateFamilyStats,
  getFamilyStats,

  registerChildInFamily,
  syncChildrenWithFamily,
  syncFamilyRelationships,
  findFamilyMemberByEntityId,

  registerPlayerInFamily,

  ageFamilyMembers,
  markFamilyMemberDead,

  searchFamilyMembers,

  getFamilySnapshot,

  validateFamilyMember,
  validateFamily,

  initializeFamily,
  resetFamily
};

export default familyAPI;

export {
  FAMILY_VERSION,

  FAMILY_RELATION_TYPES,
  FAMILY_MEMBER_TYPES,

  getRelationLabel,

  createFamilyMember,

  ensureFamilyState,

  addFamilyMember,
  getFamilyMember,
  findFamilyMemberReference,
  getAllFamilyMembers,
  updateFamilyMember,
  removeFamilyMember,

  createFamilyRelationship,
  addFamilyRelationship,
  getFamilyRelationship,
  findFamilyRelationshipReference,
  getFamilyRelationships,
  updateFamilyRelationship,
  removeFamilyRelationship,

  connectFamilyMembers,
  disconnectFamilyMembers,

  setParents,
  getParents,
  getChildren,
  getSiblings,

  getGrandparents,
  getGrandchildren,

  getFamilyOfMember,

  connectSpouses,
  disconnectSpouses,
  getSpouse,

  calculateGeneration,
  getGenerationMembers,
  calculateGenerations,

  buildFamilyTree,
  updateFamilyTree,

  createFamilyUnit,
  getFamilyUnits,
  getFamilyUnit,

  addFamilyHistory,
  getFamilyHistory,

  updateFamilyStats,
  getFamilyStats,

  registerChildInFamily,
  syncChildrenWithFamily,
  syncFamilyRelationships,
  findFamilyMemberByEntityId,

  registerPlayerInFamily,

  ageFamilyMembers,
  markFamilyMemberDead,

  searchFamilyMembers,

  getFamilySnapshot,

  validateFamilyMember,
  validateFamily,

  initializeFamily,
  resetFamily,

  familyAPI
};

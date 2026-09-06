/* ============================================================
   MMA LIFE DYNASTY
   UI — SETTINGS SCREEN
   Arquivo: js/ui/settingsScreen.js
   ============================================================ */

const SETTINGS_SCREEN_VERSION = 1;

const settingsScreenState = {
    initialized: false,
    database: null,
    lastRender: null,
    draft: {},
    message: null
};

/* ============================================================
   CONFIGURAÇÕES PADRÃO
   ============================================================ */

const DEFAULT_SETTINGS = {
    language: "pt-BR",
    currency: "USD",
    difficulty: "normal",
    notifications: true,
    autosave: true,
    autosaveInterval: "month",
    compactMode: false,
    showHints: true,
    confirmActions: true,
    animations: true
};

const LANGUAGE_OPTIONS = [
    {
        id: "pt-BR",
        label: "Português (Brasil)"
    },
    {
        id: "en",
        label: "English"
    },
    {
        id: "es",
        label: "Español"
    }
];

const CURRENCY_OPTIONS = [
    {
        id: "USD",
        label: "Dólar americano",
        symbol: "US$"
    },
    {
        id: "BRL",
        label: "Real brasileiro",
        symbol: "R$"
    },
    {
        id: "EUR",
        label: "Euro",
        symbol: "€"
    }
];

const DIFFICULTY_OPTIONS = [
    {
        id: "easy",
        label: "Fácil",
        description:
            "Mais dinheiro, recuperação melhor e progressão mais tranquila."
    },
    {
        id: "normal",
        label: "Normal",
        description:
            "Experiência equilibrada e recomendada."
    },
    {
        id: "hard",
        label: "Difícil",
        description:
            "Maior dificuldade financeira, física e competitiva."
    },
    {
        id: "legend",
        label: "Lenda",
        description:
            "Desafio máximo para construir uma dinastia."
    }
];

const AUTOSAVE_INTERVALS = [
    {
        id: "week",
        label: "Toda semana"
    },
    {
        id: "month",
        label: "Todo mês"
    },
    {
        id: "year",
        label: "Todo ano"
    }
];

/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
    if (value === undefined) {
        return undefined;
    }

    try {
        return JSON.parse(
            JSON.stringify(value)
        );
    } catch {
        return value;
    }
}

function getElement(id) {
    return document.getElementById(id);
}

function getDatabase(database = null) {
    return (
        database ||
        settingsScreenState.database ||
        window.MMA_LIFE_DATABASE ||
        {}
    );
}

function ensureContent() {
    let content =
        getElement(
            "mma-life-content"
        );

    if (!content) {
        content =
            document.createElement(
                "main"
            );

        content.id =
            "mma-life-content";

        document.body.appendChild(
            content
        );
    }

    return content;
}

function safeObject(value) {
    return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value
        : {};
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function capitalize(value) {
    if (!value) {
        return "";
    }

    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}

/* ============================================================
   SETTINGS
   ============================================================ */

function getStoredSettings(database) {
    const settings =
        database?.settings;

    return {
        ...DEFAULT_SETTINGS,
        ...safeObject(settings)
    };
}

function normalizeSettings(settings) {
    const source = {
        ...DEFAULT_SETTINGS,
        ...safeObject(settings)
    };

    if (
        !LANGUAGE_OPTIONS.some(
            option =>
                option.id ===
                source.language
        )
    ) {
        source.language =
            DEFAULT_SETTINGS.language;
    }

    if (
        !CURRENCY_OPTIONS.some(
            option =>
                option.id ===
                source.currency
        )
    ) {
        source.currency =
            DEFAULT_SETTINGS.currency;
    }

    if (
        !DIFFICULTY_OPTIONS.some(
            option =>
                option.id ===
                source.difficulty
        )
    ) {
        source.difficulty =
            DEFAULT_SETTINGS.difficulty;
    }

    if (
        !AUTOSAVE_INTERVALS.some(
            option =>
                option.id ===
                source.autosaveInterval
        )
    ) {
        source.autosaveInterval =
            DEFAULT_SETTINGS.autosaveInterval;
    }

    source.notifications =
        Boolean(
            source.notifications
        );

    source.autosave =
        Boolean(
            source.autosave
        );

    source.compactMode =
        Boolean(
            source.compactMode
        );

    source.showHints =
        Boolean(
            source.showHints
        );

    source.confirmActions =
        Boolean(
            source.confirmActions
        );

    source.animations =
        Boolean(
            source.animations
        );

    return source;
}

function getCurrentSettings(database) {
    const db =
        getDatabase(database);

    return normalizeSettings(
        getStoredSettings(db)
    );
}

function initializeDraft(
    database
) {
    settingsScreenState.draft =
        getCurrentSettings(
            database
        );

    return settingsScreenState.draft;
}

/* ============================================================
   ALTERAÇÃO DE CONFIGURAÇÕES
   ============================================================ */

function setSetting(
    key,
    value,
    database = null
) {
    const db =
        getDatabase(database);

    if (
        !Object.prototype.hasOwnProperty.call(
            DEFAULT_SETTINGS,
            key
        )
    ) {
        return false;
    }

    if (
        !settingsScreenState.draft ||
        !Object.keys(
            settingsScreenState.draft
        ).length
    ) {
        initializeDraft(db);
    }

    settingsScreenState.draft[key] =
        value;

    settingsScreenState.message = {
        type: "info",
        text: "Alteração pendente. Clique em salvar para aplicar."
    };

    render(db);

    return true;
}

/* ============================================================
   APLICAÇÃO
   ============================================================ */

function applySettings(
    database = null
) {
    const db =
        getDatabase(database);

    const settings =
        normalizeSettings(
            settingsScreenState.draft
        );

    if (!db.settings) {
        db.settings = {};
    }

    Object.assign(
        db.settings,
        settings
    );

    settingsScreenState.draft =
        clone(settings);

    settingsScreenState.message = {
        type: "success",
        text: "Configurações salvas com sucesso."
    };

    try {
        if (
            window.MMA_LIFE_SAVE &&
            typeof window
                .MMA_LIFE_SAVE
                .save ===
                "function"
        ) {
            window.MMA_LIFE_SAVE.save(
                db
            );
        } else if (
            window.saveAPI &&
            typeof window
                .saveAPI
                .save ===
                "function"
        ) {
            window.saveAPI.save(
                db
            );
        }
    } catch (error) {
        console.warn(
            "Não foi possível executar o salvamento automático:",
            error
        );
    }

    settingsScreenState.database =
        db;

    render(db);

    dispatchSettingsChanged(
        db,
        settings
    );

    return settings;
}

function resetDraft(
    database = null
) {
    const db =
        getDatabase(database);

    initializeDraft(db);

    settingsScreenState.message = {
        type: "info",
        text: "Alterações pendentes foram descartadas."
    };

    render(db);

    return settingsScreenState.draft;
}

/* ============================================================
   EVENTO DE CONFIGURAÇÕES
   ============================================================ */

function dispatchSettingsChanged(
    database,
    settings
) {
    if (
        typeof window ===
        "undefined"
    ) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-settings-changed",
            {
                detail: {
                    database,
                    settings:
                        clone(
                            settings
                        )
                }
            }
        )
    );
}

/* ============================================================
   RESET DO JOGO
   ============================================================ */

function resetGame() {
    const confirmed =
        window.confirm(
            "Tem certeza que deseja apagar o progresso atual? Esta ação não pode ser desfeita."
        );

    if (!confirmed) {
        return false;
    }

    try {
        if (
            window.MMA_LIFE_SAVE &&
            typeof window
                .MMA_LIFE_SAVE
                .reset ===
                "function"
        ) {
            window.MMA_LIFE_SAVE.reset();
        } else if (
            window.saveAPI &&
            typeof window
                .saveAPI
                .reset ===
                "function"
        ) {
            window.saveAPI.reset();
        } else {
            localStorage.removeItem(
                "mma-life-dynasty-save"
            );

            localStorage.removeItem(
                "MMA_LIFE_DYNASTY_SAVE"
            );

            localStorage.removeItem(
                "mmaLifeSave"
            );
        }
    } catch (error) {
        console.error(
            "Erro ao resetar o jogo:",
            error
        );

        return false;
    }

    settingsScreenState.message = {
        type: "success",
        text: "Progresso apagado. Reinicie o jogo para começar uma nova carreira."
    };

    render(
        settingsScreenState.database ||
        {}
    );

    return true;
}

/* ============================================================
   RENDER — COMPONENTES
   ============================================================ */

function renderSelect(
    id,
    label,
    value,
    options
) {
    return `
        <div class="settings-field">
            <label for="${escapeHTML(
                id
            )}">
                ${escapeHTML(
                    label
                )}
            </label>

            <select
                id="${escapeHTML(
                    id
                )}"
                data-setting="${escapeHTML(
                    id
                )}"
            >
                ${options
                    .map(
                        option =>
                            `
                                <option
                                    value="${escapeHTML(
                                        option.id
                                    )}"
                                    ${
                                        option.id ===
                                        value
                                            ? "selected"
                                            : ""
                                    }
                                >
                                    ${escapeHTML(
                                        option.label
                                    )}
                                </option>
                            `
                    )
                    .join("")}
            </select>
        </div>
    `;
}

function renderToggle(
    key,
    label,
    description,
    value
) {
    return `
        <div class="settings-toggle-row">
            <div class="settings-toggle-copy">
                <strong>
                    ${escapeHTML(
                        label
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        description
                    )}
                </span>
            </div>

            <label class="settings-switch">
                <input
                    type="checkbox"
                    data-setting-toggle="${escapeHTML(
                        key
                    )}"
                    ${
                        value
                            ? "checked"
                            : ""
                    }
                >

                <span class="settings-slider"></span>
            </label>
        </div>
    `;
}

/* ============================================================
   CABEÇALHO
   ============================================================ */

function renderHeader() {
    return `
        <div class="settings-header">
            <div class="settings-header-icon">
                ⚙️
            </div>

            <div>
                <span class="settings-kicker">
                    SISTEMA
                </span>

                <h2>
                    Configurações
                </h2>

                <p>
                    Personalize sua experiência no MMA Life Dynasty.
                </p>
            </div>
        </div>
    `;
}

/* ============================================================
   GERAL
   ============================================================ */

function renderGeneral(
    settings
) {
    return `
        <section class="settings-card">
            <div class="settings-card-header">
                <div>
                    <span class="settings-kicker">
                        GERAL
                    </span>

                    <h3>
                        Preferências principais
                    </h3>
                </div>
            </div>

            <div class="settings-fields-grid">
                ${renderSelect(
                    "language",
                    "Idioma",
                    settings.language,
                    LANGUAGE_OPTIONS
                )}

                ${renderSelect(
                    "currency",
                    "Moeda",
                    settings.currency,
                    CURRENCY_OPTIONS
                )}

                ${renderSelect(
                    "difficulty",
                    "Dificuldade",
                    settings.difficulty,
                    DIFFICULTY_OPTIONS
                )}
            </div>

            <div class="settings-info-box">
                <strong>
                    Dificuldade:
                    ${escapeHTML(
                        DIFFICULTY_OPTIONS.find(
                            option =>
                                option.id ===
                                settings.difficulty
                        )?.label ||
                        "Normal"
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        DIFFICULTY_OPTIONS.find(
                            option =>
                                option.id ===
                                settings.difficulty
                        )?.description ||
                        ""
                    )}
                </span>
            </div>
        </section>
    `;
}

/* ============================================================
   INTERFACE
   ============================================================ */

function renderInterface(
    settings
) {
    return `
        <section class="settings-card">
            <div class="settings-card-header">
                <div>
                    <span class="settings-kicker">
                        INTERFACE
                    </span>

                    <h3>
                        Experiência visual
                    </h3>
                </div>
            </div>

            <div class="settings-toggle-list">
                ${renderToggle(
                    "notifications",
                    "Notificações",
                    "Receber avisos de eventos, lutas, carreira e vida.",
                    settings.notifications
                )}

                ${renderToggle(
                    "showHints",
                    "Mostrar dicas",
                    "Exibe informações úteis durante o jogo.",
                    settings.showHints
                )}

                ${renderToggle(
                    "confirmActions",
                    "Confirmar ações",
                    "Pede confirmação antes de ações importantes.",
                    settings.confirmActions
                )}

                ${renderToggle(
                    "animations",
                    "Animações",
                    "Ativa efeitos e transições da interface.",
                    settings.animations
                )}

                ${renderToggle(
                    "compactMode",
                    "Modo compacto",
                    "Reduz espaçamentos para mostrar mais informações na tela.",
                    settings.compactMode
                )}
            </div>
        </section>
    `;
}

/* ============================================================
   SALVAMENTO
   ============================================================ */

function renderSaveSettings(
    settings
) {
    return `
        <section class="settings-card">
            <div class="settings-card-header">
                <div>
                    <span class="settings-kicker">
                        PROGRESSO
                    </span>

                    <h3>
                        Salvamento
                    </h3>
                </div>
            </div>

            <div class="settings-toggle-list">
                ${renderToggle(
                    "autosave",
                    "Salvamento automático",
                    "Salva o progresso automaticamente durante a carreira.",
                    settings.autosave
                )}
            </div>

            <div class="settings-fields-grid settings-save-grid">
                ${renderSelect(
                    "autosaveInterval",
                    "Frequência",
                    settings.autosaveInterval,
                    AUTOSAVE_INTERVALS
                )}
            </div>

            <div class="settings-actions">
                <button
                    class="settings-button secondary"
                    data-settings-action="save-now"
                >
                    💾 Salvar agora
                </button>

                <button
                    class="settings-button secondary"
                    data-settings-action="load-save"
                >
                    📂 Carregar progresso
                </button>
            </div>
        </section>
    `;
}

/* ============================================================
   INFORMAÇÕES
   ============================================================ */

function renderAbout() {
    return `
        <section class="settings-card">
            <div class="settings-card-header">
                <div>
                    <span class="settings-kicker">
                        SOBRE
                    </span>

                    <h3>
                        MMA Life Dynasty
                    </h3>
                </div>
            </div>

            <div class="settings-about">
                <div class="settings-about-row">
                    <span>
                        Versão da interface
                    </span>

                    <strong>
                        ${PROFILE_VERSION_TEXT()}
                    </strong>
                </div>

                <div class="settings-about-row">
                    <span>
                        Sistema
                    </span>

                    <strong>
                        MMA Life Dynasty
                    </strong>
                </div>

                <div class="settings-about-row">
                    <span>
                        Arquitetura
                    </span>

                    <strong>
                        Career & Dynasty
                    </strong>
                </div>
            </div>
        </section>
    `;
}

function PROFILE_VERSION_TEXT() {
    return `UI ${SETTINGS_SCREEN_VERSION}.0`;
}

/* ============================================================
   ZONA DE PERIGO
   ============================================================ */

function renderDangerZone() {
    return `
        <section class="settings-card danger-card">
            <div class="settings-card-header">
                <div>
                    <span class="settings-kicker">
                        ATENÇÃO
                    </span>

                    <h3>
                        Dados do jogo
                    </h3>
                </div>
            </div>

            <div class="danger-content">
                <div>
                    <strong>
                        Reiniciar carreira
                    </strong>

                    <p>
                        Apaga o progresso salvo e permite começar uma nova história.
                    </p>
                </div>

                <button
                    class="settings-button danger"
                    data-settings-action="reset-game"
                >
                    🗑️ Apagar progresso
                </button>
            </div>
        </section>
    `;
}

/* ============================================================
   MENSAGEM
   ============================================================ */

function renderMessage() {
    const message =
        settingsScreenState.message;

    if (!message) {
        return "";
    }

    const className =
        message.type === "success"
            ? "success"
            : message.type === "info"
                ? "info"
                : "error";

    return `
        <div class="settings-message ${className}">
            ${escapeHTML(
                message.text
            )}
        </div>
    `;
}

/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render(
    database = null
) {
    const db =
        getDatabase(database);

    settingsScreenState.database =
        db;

    if (
        !settingsScreenState.draft ||
        !Object.keys(
            settingsScreenState.draft
        ).length
    ) {
        initializeDraft(db);
    }

    const settings =
        normalizeSettings(
            settingsScreenState.draft
        );

    const content =
        ensureContent();

    content.innerHTML = `
        <div class="settings-screen">

            ${renderHeader()}

            ${renderMessage()}

            <div class="settings-grid">

                ${renderGeneral(
                    settings
                )}

                ${renderInterface(
                    settings
                )}

                ${renderSaveSettings(
                    settings
                )}

                ${renderAbout()}

                ${renderDangerZone()}

            </div>

            <div class="settings-footer-actions">
                <button
                    class="settings-button secondary"
                    data-settings-action="discard"
                >
                    Descartar
                </button>

                <button
                    class="settings-button primary"
                    data-settings-action="apply"
                >
                    ✓ Salvar configurações
                </button>
            </div>

        </div>
    `;

    profileScreenStateLastRender();

    bindEvents();

    return content;
}

function profileScreenStateLastRender() {
    settingsScreenState.lastRender =
        Date.now();
}

/* ============================================================
   EVENTOS DOM
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll(
            "[data-setting]"
        )
        .forEach(element => {
            element.addEventListener(
                "change",
                event => {
                    const key =
                        event.target
                            .dataset
                            .setting;

                    setSetting(
                        key,
                        event.target.value
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-setting-toggle]"
        )
        .forEach(element => {
            element.addEventListener(
                "change",
                event => {
                    const key =
                        event.target
                            .dataset
                            .settingToggle;

                    setSetting(
                        key,
                        event.target.checked
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-settings-action]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleAction(
                        button.dataset
                            .settingsAction
                    );
                }
            );
        });
}

function handleAction(
    action
) {
    const database =
        settingsScreenState.database ||
        getDatabase();

    switch (action) {
        case "apply":
            applySettings(
                database
            );
            break;

        case "discard":
            resetDraft(
                database
            );
            break;

        case "reset-game":
            resetGame();
            break;

        case "save-now":
            saveNow(database);
            break;

        case "load-save":
            loadSave(database);
            break;

        default:
            break;
    }
}

/* ============================================================
   SALVAR AGORA
   ============================================================ */

function saveNow(database) {
    try {
        if (
            window.MMA_LIFE_SAVE &&
            typeof window
                .MMA_LIFE_SAVE
                .save ===
                "function"
        ) {
            window.MMA_LIFE_SAVE.save(
                database
            );

            settingsScreenState.message = {
                type: "success",
                text: "Jogo salvo com sucesso."
            };
        } else if (
            window.saveAPI &&
            typeof window
                .saveAPI
                .save ===
                "function"
        ) {
            window.saveAPI.save(
                database
            );

            settingsScreenState.message = {
                type: "success",
                text: "Jogo salvo com sucesso."
            };
        } else {
            localStorage.setItem(
                "mma-life-dynasty-save",
                JSON.stringify(
                    database
                )
            );

            settingsScreenState.message = {
                type: "success",
                text: "Jogo salvo localmente."
            };
        }
    } catch (error) {
        console.error(
            "Erro ao salvar:",
            error
        );

        settingsScreenState.message = {
            type: "error",
            text: "Não foi possível salvar o jogo."
        };
    }

    render(database);
}

/* ============================================================
   CARREGAR
   ============================================================ */

function loadSave(database) {
    try {
        let loaded = null;

        if (
            window.MMA_LIFE_SAVE &&
            typeof window
                .MMA_LIFE_SAVE
                .load ===
                "function"
        ) {
            loaded =
                window.MMA_LIFE_SAVE.load();
        } else if (
            window.saveAPI &&
            typeof window
                .saveAPI
                .load ===
                "function"
        ) {
            loaded =
                window.saveAPI.load();
        } else {
            const raw =
                localStorage.getItem(
                    "mma-life-dynasty-save"
                );

            if (raw) {
                loaded =
                    JSON.parse(raw);
            }
        }

        if (
            loaded &&
            typeof loaded ===
                "object"
        ) {
            settingsScreenState.database =
                loaded;

            initializeDraft(
                loaded
            );

            settingsScreenState.message = {
                type: "success",
                text: "Progresso carregado."
            };
        } else {
            settingsScreenState.message = {
                type: "info",
                text: "Nenhum salvamento encontrado."
            };
        }
    } catch (error) {
        console.error(
            "Erro ao carregar:",
            error
        );

        settingsScreenState.message = {
            type: "error",
            text: "Não foi possível carregar o progresso."
        };
    }

    render(
        settingsScreenState.database ||
        database
    );
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function open(
    database = null
) {
    return initialize(
        database
    );
}

function close() {
    const content =
        getElement(
            "mma-life-content"
        );

    if (content) {
        content.innerHTML = "";
    }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null
) {
    const db =
        getDatabase(database);

    settingsScreenState.database =
        db;

    initializeDraft(db);

    settingsScreenState.initialized =
        true;

    injectStyles();

    return render(db);
}

function refresh(
    database = null
) {
    if (database) {
        settingsScreenState.database =
            database;
    }

    injectStyles();

    return render(
        settingsScreenState.database ||
        getDatabase()
    );
}

/* ============================================================
   ESTADO
   ============================================================ */

function getState() {
    return clone(
        settingsScreenState
    );
}

function getSettings(
    database = null
) {
    return clone(
        getCurrentSettings(
            database
        )
    );
}

function getDraft() {
    return clone(
        settingsScreenState.draft
    );
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getSnapshot() {
    const database =
        settingsScreenState.database ||
        getDatabase();

    return {
        version:
            SETTINGS_SCREEN_VERSION,

        initialized:
            settingsScreenState.initialized,

        settings:
            getSettings(
                database
            ),

        draft:
            getDraft(),

        lastRender:
            settingsScreenState.lastRender
    };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validate(
    database = null
) {
    const db =
        database ||
        settingsScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (db) {
        const settings =
            getStoredSettings(
                db
            );

        if (
            !LANGUAGE_OPTIONS.some(
                option =>
                    option.id ===
                    settings.language
            )
        ) {
            warnings.push(
                "Idioma configurado não reconhecido."
            );
        }

        if (
            !CURRENCY_OPTIONS.some(
                option =>
                    option.id ===
                    settings.currency
            )
        ) {
            warnings.push(
                "Moeda configurada não reconhecida."
            );
        }

        if (
            !DIFFICULTY_OPTIONS.some(
                option =>
                    option.id ===
                    settings.difficulty
            )
        ) {
            warnings.push(
                "Dificuldade configurada não reconhecida."
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,
        warnings
    };
}

/* ============================================================
   ESTILOS
   ============================================================ */

function injectStyles() {
    if (
        getElement(
            "mma-life-settings-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-settings-screen-styles";

    style.textContent = `
        .settings-screen {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .settings-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding: 22px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 19px;
            background: rgba(255,255,255,.035);
        }

        .settings-header-icon {
            width: 52px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
            background: rgba(255,255,255,.07);
            font-size: 23px;
        }

        .settings-header h2 {
            margin: 0;
            font-size: 25px;
        }

        .settings-header p {
            margin: 5px 0 0;
            font-size: 10px;
            opacity: .48;
        }

        .settings-kicker {
            display: block;
            margin-bottom: 5px;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .42;
        }

        .settings-message {
            margin-bottom: 15px;
            padding: 12px 14px;
            border-radius: 11px;
            font-size: 10px;
            font-weight: 700;
        }

        .settings-message.success {
            background: rgba(80,200,120,.1);
            border: 1px solid rgba(80,200,120,.2);
        }

        .settings-message.info {
            background: rgba(255,255,255,.06);
            border: 1px solid rgba(255,255,255,.1);
        }

        .settings-message.error {
            background: rgba(220,70,70,.1);
            border: 1px solid rgba(220,70,70,.2);
        }

        .settings-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 13px;
        }

        .settings-card {
            padding: 19px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .settings-card-header {
            margin-bottom: 17px;
        }

        .settings-card-header h3 {
            margin: 0;
            font-size: 16px;
        }

        .settings-fields-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
        }

        .settings-field label {
            display: block;
            margin-bottom: 6px;
            font-size: 9px;
            font-weight: 800;
            opacity: .55;
        }

        .settings-field select {
            width: 100%;
            padding: 11px 12px;
            box-sizing: border-box;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 10px;
            background: rgba(255,255,255,.045);
            color: inherit;
            outline: none;
            font: inherit;
            font-size: 10px;
        }

        .settings-field select:focus {
            border-color: rgba(255,255,255,.2);
        }

        .settings-info-box {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-top: 14px;
            padding: 12px;
            border-radius: 11px;
            background: rgba(255,255,255,.035);
        }

        .settings-info-box strong {
            font-size: 10px;
        }

        .settings-info-box span {
            font-size: 9px;
            line-height: 1.5;
            opacity: .48;
        }

        .settings-toggle-list {
            display: grid;
            gap: 0;
        }

        .settings-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            padding: 13px 0;
            border-bottom: 1px solid rgba(255,255,255,.055);
        }

        .settings-toggle-row:last-child {
            border-bottom: 0;
        }

        .settings-toggle-copy {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .settings-toggle-copy strong {
            font-size: 10px;
        }

        .settings-toggle-copy span {
            max-width: 420px;
            font-size: 8px;
            line-height: 1.45;
            opacity: .43;
        }

        .settings-switch {
            position: relative;
            width: 42px;
            height: 23px;
            flex-shrink: 0;
        }

        .settings-switch input {
            width: 0;
            height: 0;
            opacity: 0;
        }

        .settings-slider {
            position: absolute;
            inset: 0;
            cursor: pointer;
            border-radius: 99px;
            background: rgba(255,255,255,.12);
            transition: .2s;
        }

        .settings-slider:before {
            content: "";
            position: absolute;
            width: 17px;
            height: 17px;
            left: 3px;
            top: 3px;
            border-radius: 50%;
            background: rgba(255,255,255,.8);
            transition: .2s;
        }

        .settings-switch input:checked + .settings-slider {
            background: rgba(255,255,255,.28);
        }

        .settings-switch input:checked + .settings-slider:before {
            transform: translateX(19px);
        }

        .settings-save-grid {
            margin-top: 15px;
        }

        .settings-actions {
            display: flex;
            gap: 8px;
            margin-top: 14px;
        }

        .settings-button {
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 10px;
            padding: 10px 13px;
            color: inherit;
            background: rgba(255,255,255,.045);
            font: inherit;
            font-size: 9px;
            font-weight: 800;
            cursor: pointer;
        }

        .settings-button:hover {
            background: rgba(255,255,255,.08);
        }

        .settings-button.primary {
            background: rgba(255,255,255,.13);
            border-color: rgba(255,255,255,.17);
        }

        .settings-button.danger {
            background: rgba(220,70,70,.08);
            border-color: rgba(220,70,70,.18);
        }

        .settings-about {
            display: grid;
            gap: 0;
        }

        .settings-about-row {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255,255,255,.055);
        }

        .settings-about-row:last-child {
            border-bottom: 0;
        }

        .settings-about-row span {
            font-size: 9px;
            opacity: .45;
        }

        .settings-about-row strong {
            font-size: 9px;
            text-align: right;
        }

        .danger-card {
            grid-column: 1 / -1;
            border-color: rgba(220,70,70,.14);
        }

        .danger-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        .danger-content strong {
            display: block;
            font-size: 11px;
        }

        .danger-content p {
            margin: 5px 0 0;
            font-size: 9px;
            line-height: 1.5;
            opacity: .45;
        }

        .settings-footer-actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 15px;
            padding-bottom: 20px;
        }

        @media (max-width: 800px) {
            .settings-grid {
                grid-template-columns: 1fr;
            }

            .danger-card {
                grid-column: auto;
            }
        }

        @media (max-width: 560px) {
            .settings-screen {
                padding: 14px;
            }

            .settings-header {
                padding: 17px;
            }

            .settings-header h2 {
                font-size: 21px;
            }

            .settings-actions,
            .settings-footer-actions {
                flex-direction: column;
            }

            .settings-button {
                width: 100%;
            }

            .danger-content {
                align-items: stretch;
                flex-direction: column;
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

/* ============================================================
   API
   ============================================================ */

const settingsScreenAPI = {
    version:
        SETTINGS_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    getSettings,
    getDraft,
    setSetting,
    applySettings,
    resetDraft,

    saveNow,
    loadSave,
    resetGame,

    getState,
    getSnapshot,
    validate
};

/* ============================================================
   GLOBAL
   ============================================================ */

if (
    typeof window !==
    "undefined"
) {
    window.settingsScreenAPI =
        settingsScreenAPI;

    window.MMA_LIFE_SETTINGS_SCREEN =
        settingsScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-settings-screen-ready",
            {
                detail:
                    settingsScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    SETTINGS_SCREEN_VERSION,
    settingsScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    getSettings,
    getDraft,
    setSetting,
    applySettings,
    resetDraft,

    saveNow,
    loadSave,
    resetGame,

    getState,
    getSnapshot,
    validate
};

export default settingsScreenAPI;

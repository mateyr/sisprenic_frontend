# Informe Técnico — SISPRENIC Frontend

**Fecha:** 2026-07-16
**Alcance:** Revisión integral de arquitectura, seguridad, manejo de errores, rendimiento, calidad de código y preparación para despliegue.
**Stack:** React 19 + TypeScript (strict) + Vite 7 + TanStack (Router/Query/Form/Table) + Tailwind 4 + Zod. ~83 archivos TS/TSX, arquitectura modular por features.

---

## 1. Bloqueantes de despliegue

### 🔴 CRÍTICO — El proyecto no compila: `npm run build` falla

`tsc -b` produce 3 errores:

1. `src/modules/clients/components/client-form-dialog.tsx:60` — el schema Zod con `z.optional().default()` no es asignable al validador de TanStack Form (el tipo de entrada `secondName?: string` no coincide con los `defaultValues`).
2. `src/modules/payments/components/new-payment-dialog.tsx:56` — mismo patrón con `note: z.optional()`.
3. `src/routes/root.tsx:1` — importa el tipo `AuthContext` desde `@/context/auth`, pero ese módulo no lo exporta (el tipo vive en `src/modules/authentication/types/user-types.ts`).

**Por qué importa:** el script `build` es `tsc -b && vite build`; no es posible generar el artefacto de producción. Es lo primero a resolver.

**Recomendación:** en los schemas, alinear entrada/salida (p. ej. `z.string().optional()` sin `.default()`, o tipar los defaults como el input del schema); en `root.tsx`, importar el tipo desde `user-types.ts` o re-exportarlo desde `context/auth`.

### 🔴 CRÍTICO — URL del backend hardcodeada a `localhost`

`const API_BASE_URL = "http://localhost:5162"` está duplicada en los 4 servicios (`auth-api.ts:4`, `client-api.ts:8`, `loan-api.ts:4`, `payment-api.ts:5`). No existe ningún `.env`, ni uso de `import.meta.env`.

**Por qué importa:** desplegada tal cual, la app apuntará al localhost de cada usuario y nada funcionará. Además es HTTP plano.

**Recomendación:** centralizar en un solo módulo (`src/lib/api-client.ts`) leyendo `import.meta.env.VITE_API_BASE_URL`, con `.env.example` versionado y valores por entorno. En producción, HTTPS obligatorio (las cookies de sesión deberán ser `Secure`).

### 🟠 ALTO — El Dashboard muestra datos falsos

`src/modules/dashboard/pages/dashboard.tsx:28-49` usa `MOCK_SUMMARY`, `MOCK_RECENT_LOANS` y `MOCK_RECENT_PAYMENTS` hardcodeados.

**Por qué importa:** es la pantalla de aterrizaje; en un sistema de préstamos, mostrar cifras financieras inventadas ("Total Prestado: 385,000") es inaceptable en producción y erosiona la confianza del usuario.

**Recomendación:** conectarlo a endpoints reales antes del despliegue, o retirar la página del menú/registro de rutas hasta que exista el backend correspondiente.

### 🟠 ALTO — Devtools del router incluidas incondicionalmente

`src/routes/root.tsx:13` renderiza `<TanStackRouterDevtools />` siempre.

**Por qué importa:** las devtools se empaquetan en el bundle de producción (peso extra) y quedan accesibles al usuario final, exponiendo el árbol de rutas y estado interno.

**Recomendación:** cargarlas con lazy import condicionado: `import.meta.env.DEV ? lazy(...) : () => null`, patrón recomendado por la propia documentación de TanStack.

---

## 2. Seguridad y autenticación

### 🟠 ALTO — La sesión nunca se revalida contra el servidor

`src/context/auth.tsx`: al montar, el estado de autenticación se toma exclusivamente de `localStorage` (`sisprenic.user`). Nunca se llama a `getMe()` para verificar que la cookie de sesión siga viva, y no hay manejo global de respuestas 401.

**Por qué importa:** cuando la cookie expire, el usuario verá una UI "autenticada" donde cada petición falla con mensajes genéricos ("Error al obtener los préstamos"), sin ser redirigido al login. Es la fuente número uno de tickets de soporte post-despliegue en apps con cookies de sesión.

**Recomendación:** (1) al arrancar, validar la sesión con `getMe()` (usando el valor de localStorage solo como estado optimista); (2) en el cliente HTTP central, interceptar 401 → limpiar estado y redirigir a `/login`.

### 🟡 MEDIO — Autorización de rutas basada en datos del cliente

`src/routes/routes.tsx:16-44` decide el acceso según el `menu` guardado en localStorage, que el usuario puede editar libremente en las DevTools del navegador.

**Por qué importa:** como control de UX es válido, pero solo es seguro si **cada endpoint del backend** aplica autorización propia. Si algún endpoint confía en que "el frontend no muestra esa pantalla", hay un agujero.

**Recomendación:** confirmar que el backend autoriza por rol/permiso en cada endpoint. Documentar explícitamente que el menú del frontend es cosmético.

### 🟡 MEDIO — CORS/cookies cross-origin sin preparación visible

Todas las peticiones usan `credentials: "include"`. Si frontend y backend se despliegan en orígenes distintos, las cookies requieren `SameSite=None; Secure` y CORS con `Access-Control-Allow-Credentials` y origen explícito. También conviene verificar que el backend tenga protección CSRF (con autenticación por cookie, el frontend no envía ningún token anti-CSRF).

**Recomendación:** decidir la topología de despliegue ya (mismo origen con reverse proxy es lo más simple y elimina CORS/SameSite/parte del riesgo CSRF) y probar el flujo de login en un entorno staging idéntico a producción.

### 🔵 BAJO — Endpoint de logout inconsistente y sin verificación

`src/modules/authentication/services/auth-api.ts:35`: login usa `/auth/login` pero logout usa `/logout` (sin prefijo), y no verifica `response.ok`. Confirmar que el endpoint es correcto; un logout que falla silenciosamente deja la cookie viva en el servidor.

---

## 3. Arquitectura y organización

### ✅ FORTALEZAS

- **Estructura modular por features** (`modules/{clients,loans,payments,authentication}/{components,hooks,pages,services,types}`): límites claros, fácil de escalar y de navegar. Es la decisión arquitectónica más acertada del proyecto.
- **`src/lib/api-errors.ts`**: manejo de ProblemDetails (RFC 9457) con parsing defensivo, bien documentado, con `ProblemDetailsError` tipado que los formularios capturan para feedback por campo. Nivel profesional.
- **`src/lib/query-keys.ts` centralizado**: evita invalidaciones inconsistentes, un error común con React Query.
- **`src/lib/page-registry.ts`** con `lazy()`: code-splitting por página desde el día uno.
- **TypeScript en modo estricto** con `verbatimModuleSyntax`, `noUnusedLocals`, etc.
- **Cookies HttpOnly** en lugar de tokens en localStorage (solo se persiste info de usuario, no credenciales).
- Buen uso de Zod como fuente única de tipos de formulario (`z.infer`).

### 🟠 ALTO — No existe un cliente HTTP central

Los 4 servicios repiten el mismo patrón `fetch` (~40 líneas cada uno) con inconsistencias entre sí: algunos GET no capturan errores de red (`getLoans` lanzará "Failed to fetch" en inglés al usuario si el servidor está caído), otros sí; algunos usan `throwApiError`, otros `Error` genérico.

**Por qué importa:** cada corrección transversal (base URL, 401, timeouts, errores de red) hay que aplicarla en ~20 funciones. Es la principal deuda técnica del proyecto.

**Recomendación:** un wrapper `apiFetch<T>(path, options)` que concentre base URL, `credentials`, manejo de red caída, `throwApiError` y el futuro manejo de 401. Los servicios quedarían en 2-3 líneas por función.

### 🟡 MEDIO — Conversión de `interestRate` asimétrica y en la capa equivocada

`src/modules/loans/services/loan-api.ts:39`: `createLoan` divide `interestRate / 100` dentro del servicio, pero `updateLoan` espera que el caller ya lo haya dividido (`loan-edit.tsx:134` lo hace). La misma conversión vive en dos capas distintas.

**Por qué importa:** en un sistema financiero, una tasa aplicada 100× (o 1/100×) por olvidar dónde ocurre la conversión es un bug de alto impacto y fácil de introducir.

**Recomendación:** definir un solo punto de conversión (idealmente un mapper `toLoanPayload(formData)` junto al schema) y que ambos endpoints lo usen.

### 🟡 MEDIO — Patrones de mutación inconsistentes

Payments y clients usan `useMutation` + invalidación de queries; `loan-create.tsx:42` llama `createLoan` directo sin invalidar `queryKeys.loans.all()` (funciona solo porque el remount refetchea con `staleTime` 0). Además `useCreatePayment` invalida `loans.detail` pero no `loans.payments` ni `payments.all`.

**Recomendación:** estandarizar: toda escritura pasa por un hook `useMutation` que invalida las keys afectadas.

### 🔵 BAJO — Duplicaciones menores

`getClient` y `getClientDetail` llaman al mismo endpoint con tipos distintos (`client-api.ts:22-44`); `LoanEditForm` re-declara inline la forma de `Client` en sus props en lugar de importar el tipo.

---

## 4. Manejo de errores y resiliencia

### 🟠 ALTO — Sin ErrorBoundary ni fallbacks de error/carga globales

No hay `defaultErrorComponent` en el router ni ErrorBoundary de React; el `<Suspense>` de `main-layout.tsx:29` no tiene `fallback`, y si un chunk lazy falla al cargar (deploy nuevo con hashes viejos en caché — escenario típico de Vite en producción) la app queda en blanco.

**Recomendación:** agregar `defaultErrorComponent` y `defaultPendingComponent` al router, un fallback en el Suspense, y manejar el error de carga de chunks (recargar la página es la mitigación estándar).

### 🟡 MEDIO — QueryClient sin configuración

`new QueryClient()` con defaults: 3 reintentos con backoff incluso para 404/errores de servidor, `staleTime` 0 (refetch agresivo).

**Recomendación:** configurar `retry` (p. ej. no reintentar en errores 4xx) y un `staleTime` razonable (30–60 s para listados) para reducir carga y latencia percibida.

### 🔵 BAJO — Hack reconocido en login

`login-form.tsx:44-46`: `await sleep(1)` para esperar la propagación del estado de auth, con comentario que admite que es un hack. Además el parámetro `?redirect=` que `routes.tsx` genera al expulsar a un usuario no autenticado **nunca se consume**: tras login siempre se navega a la ruta por defecto, perdiendo la página que el usuario intentaba visitar.

---

## 5. Escalabilidad y rendimiento

### 🟡 MEDIO — Sin paginación en listados ni en API

`getLoans`, `getClients`, `getPayments` traen colecciones completas y `CustomTable` no tiene modelo de paginación/ordenamiento/filtrado del lado servidor.

**Por qué importa:** un sistema de préstamos acumula registros indefinidamente (los pagos crecen rápido). Con cientos/miles de filas, la carga y el render se degradarán.

**Recomendación:** no bloquea el despliegue inicial, pero acordar ya el contrato de paginación con el backend para no rediseñar las tablas después. Al menos añadir paginación cliente en `CustomTable` a corto plazo.

---

## 6. Calidad, prácticas y tooling

### 🟠 ALTO — Cero tests y sin CI

No existe ningún archivo de test, ningún framework de testing configurado, ni pipeline de CI. El hecho de que `main` esté en un estado que no compila lo demuestra: nada lo detectó.

**Recomendación mínima pre-despliegue:** un workflow de CI que ejecute `pnpm lint && pnpm build` en cada push/PR. Después, Vitest + Testing Library empezando por lo crítico: `parseFieldErrors` (ya diseñado para ser testeable), `menu-utils`, la conversión de `interestRate` y el flujo de login.

### 🟡 MEDIO — Formato y lint incompletos

No hay Prettier (o equivalente) y se nota: `formats.ts` usa 4 espacios, el resto 2; `loan-types.ts:15-20` usa alineación manual. ESLint usa `tseslint.configs.recommended` sin reglas type-checked (el propio README del template recomienda subirlas para producción).

### 🟡 MEDIO — Documentación inexistente

El README es la plantilla de Vite sin tocar. No documenta cómo levantar el proyecto, la URL del backend esperada, ni el flujo de despliegue.

**Recomendación:** README con setup, variables de entorno, y un `CLAUDE.md`/`CONTRIBUTING` breve con las convenciones (dónde va la conversión de tasas, patrón de mutaciones, etc.).

### 🔵 BAJO — Detalles varios

- `formatCurrency` no muestra símbolo de moneda; usar `style: "currency", currency: "NIO"` para evitar ambigüedad en cifras financieras.
- `index.html` tiene `lang="en"` (la app es en español) y el favicon de Vite por defecto.
- El enlace "¿Olvidaste tu contraseña?" apunta a `#` (funcionalidad inexistente); mejor retirarlo hasta implementarla.
- 7 `TODO` activos en el código; los de `menu-utils.ts:14` (menús anidados no recursivos) conviene resolver o descartar antes de que el backend envíe menús profundos.
- Un `pnpm-workspace.yaml` en la raíz del frontend sugiere restos de configuración de monorepo; verificar que es intencional.

---

## Prioridades sugeridas antes del despliegue

1. **Arreglar los 3 errores de compilación** (sin esto no hay build).
2. **Externalizar `API_BASE_URL` a variables de entorno** y crear el cliente HTTP central.
3. **Manejo global de 401** + revalidación de sesión al arrancar.
4. **Quitar los mocks del dashboard** (o la página) y condicionar las devtools a desarrollo.
5. **CI mínimo** (`lint + build`) para que el punto 1 no se repita.
6. ErrorBoundary/fallbacks del router y prueba del flujo completo login→CRUD en un staging con la topología real de producción (CORS/cookies).

---

## Balance general

La arquitectura de base es sólida y moderna — la estructura modular, el manejo de ProblemDetails y la centralización de query keys están por encima del promedio para un proyecto de este tamaño. El riesgo no está en el diseño sino en la **preparación operativa**: configuración por entorno, ciclo de vida de la sesión, y la ausencia total de verificación automatizada.

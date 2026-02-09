(() => {
  // helpers
  const $ = (id) => document.getElementById(id);

  function safeText(v) {
    return (v === null || v === undefined) ? "" : String(v);
  }

  function statusBadge(status) {
    const s = safeText(status || "draft");
    const map = {
      draft: "secondary",
      in_review: "primary",
      verified: "success",
      rejected: "danger",
    };
    const cls = map[s] || "secondary";
    return `<span class="badge bg-${cls}">${s}</span>`;
  }

  function pickImageForCase(c) {
    const title = encodeURIComponent((c?.title || "GEvidence").slice(0, 32));
    return `https://placehold.co/600x320/0F4C81/FFFFFF?text=${title}`;
  }

  function ensureNftModalExists() {
    if (document.getElementById("nftModal")) return;

    const modalHtml = `
      <div class="modal fade" id="nftModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-ge-blue text-white">
              <h5 class="modal-title">NFT сертификат</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="nftModalBody"></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  function openNftModal(caseObj) {
    ensureNftModalExists();

    const body = document.getElementById("nftModalBody");
    const cert = caseObj?.nftCertificate;

    if (!cert) {
      body.innerHTML = `
        <div class="alert alert-warning mb-0">
          Для этого кейса NFT сертификат ещё не создан.
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="alert alert-success fw-bold">
          Сертификат существует и привязан к кейсу.
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <div class="p-3 border rounded-3">
              <div class="fw-bold mb-2">Основные данные</div>
              <div><b>tokenId:</b> ${safeText(cert.tokenId)}</div>
              <div><b>status:</b> ${safeText(cert.status)}</div>
              <div><b>caseId:</b> ${safeText(caseObj._id)}</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="p-3 border rounded-3">
              <div class="fw-bold mb-2">Транзакция / сеть</div>
              <div style="word-break:break-all"><b>txHash:</b> ${safeText(cert.txHash)}</div>
              <div><b>network:</b> ${safeText(cert.network || "testnet")}</div>
              <div><b>issuedAt:</b> ${cert.issuedAt ? new Date(cert.issuedAt).toLocaleString() : "-"}</div>
            </div>
          </div>

          <div class="col-12">
            <div class="p-3 border rounded-3">
              <div class="fw-bold mb-2">Метаданные</div>
              <pre class="mb-0" style="white-space:pre-wrap">${JSON.stringify(cert, null, 2)}</pre>
            </div>
          </div>
        </div>
      `;
    }

    // Bootstrap modal
    const modalEl = document.getElementById("nftModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  // fade-in safety 
  function initFadeInOnScroll() {
    document.documentElement.classList.add("js-ready");

    const els = document.querySelectorAll(".fade-in-on-scroll");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1 }
    );

    els.forEach((el) => obs.observe(el));
  }

  // API
  async function fetchCases() {
    const res = await fetch("/cases", { method: "GET" });
    let data = null;
    try { data = await res.json(); } catch { data = null; }

    if (!res.ok) {
      const msg = data?.error || `Failed to load cases. HTTP ${res.status}`;
      throw new Error(msg);
    }
    if (!Array.isArray(data)) return [];
    return data;
  }

  // render
  function caseToCard(c) {
    const title = safeText(c?.title || "Untitled");
    const orgId = safeText(c?.orgId || "-");
    const country = safeText(c?.site?.country || "-");
    const city = safeText(c?.site?.city || "-");
    const metricKey = safeText(c?.metric?.key || "-");
    const metricUnit = safeText(c?.metric?.unit || "-");
    const status = safeText(c?.status || "draft");

    const hasNft = !!c?.nftCertificate;
    const nftBtnText = hasNft ? "NFT сертификат" : "NFT нет";

    const img = pickImageForCase(c);

    return `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <img src="${img}" class="card-img-top" alt="${title}" style="object-fit:cover; height:220px;">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <h5 class="card-title mb-2">${title}</h5>
              ${statusBadge(status)}
            </div>

            <div class="text-muted small mb-2">
              <div><b>orgId:</b> ${orgId}</div>
              <div><b>site:</b> ${country}, ${city}</div>
              <div><b>metric:</b> ${metricKey} (${metricUnit})</div>
            </div>

            <div class="mt-auto d-grid gap-2">
              <button class="btn btn-outline-primary btn-sm" data-nft-btn="${safeText(c?._id)}">
                ${nftBtnText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCases(list, cases) {
    if (!list) return;

    if (!cases.length) {
      list.innerHTML = `<div class="col-12"><p class="text-muted text-center">Пока нет verification cases.</p></div>`;
      return;
    }

    list.innerHTML = cases.map(caseToCard).join("");

    const byId = new Map(cases.map((x) => [String(x._id), x]));
    document.querySelectorAll("[data-nft-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-nft-btn");
        const obj = byId.get(String(id));
        openNftModal(obj);
      });
    });
  }

  // --- main ---
  async function main() {
    initFadeInOnScroll();

    const listEl = $("projectList");
    const searchEl = $("searchBar");

    let allCases = [];

    async function refresh() {
      try {
        allCases = await fetchCases();
      } catch (e) {
        const msg = safeText(e?.message || "Не удалось загрузить cases.");
        if (listEl) {
          listEl.innerHTML = `
            <div class="col-12">
              <div class="alert alert-danger text-center mb-0">
                ${msg} (Проверь API <b>/cases</b>)
              </div>
            </div>
          `;
        }
        return;
      }

      applyFilters();
    }

    function applyFilters() {
      const q = safeText(searchEl?.value || "").toLowerCase().trim();

      let filtered = allCases.slice();
      if (q) {
        filtered = filtered.filter((c) => {
          const t = safeText(c?.title).toLowerCase();
          const org = safeText(c?.orgId).toLowerCase();
          const city = safeText(c?.site?.city).toLowerCase();
          const country = safeText(c?.site?.country).toLowerCase();
          return t.includes(q) || org.includes(q) || city.includes(q) || country.includes(q);
        });
      }

      renderCases(listEl, filtered);
    }

    if (searchEl) {
      searchEl.addEventListener("input", applyFilters);
    }

    await refresh();
  }

  document.addEventListener("DOMContentLoaded", main);
})();
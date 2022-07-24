(impl-trait .sip009.sip009-nft-trait)

(define-non-fungible-token Burak-Art uint)

(define-map ArtMapping { id: uint } { price: (string-ascii 256) })

(define-constant ERR (err u99))

(define-data-var current-id uint u0)


(define-read-only (get-last-token-id)   
    (ok (var-get current-id))
)

(define-read-only (get-token-uri (id uint))
  (ok (get price (map-get? ArtMapping {id: id})))
)

(define-read-only (get-owner (id uint)) 
   (ok (nft-get-owner? Burak-Art id))
)

(define-public (transfer (id uint) (sender principal) (recipient principal)) 
    (begin 
        (asserts! (is-eq sender tx-sender) ERR)
        (nft-transfer? Burak-Art id sender recipient)
    )
)

(define-public (mint! (price (string-ascii 256))) 
    (let 
        (
            (last-token-id (+ (var-get current-id) u1))
        )
        (try! (nft-mint? Burak-Art last-token-id tx-sender))

        (map-insert ArtMapping {id: last-token-id} {price: price})

        (var-set current-id last-token-id)

        (ok "Done")
    )
)

(define-public (burn! (id uint)) 
    (nft-burn? Burak-Art id tx-sender)
)
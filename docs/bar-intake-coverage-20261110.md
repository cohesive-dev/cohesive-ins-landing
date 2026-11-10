# Bar intake coverage answers

The paid `/bar` route still accepts restaurants that arrive there. Its advertising audience is bars, but the website form does not reject legitimate restaurant inquiries. No nightclub choice is offered.

The bar form shows `Over 50% to under 70%` and `70% or more` instead of a single high-alcohol choice. The exact selection is saved under `Alcohol share range`; `Alcohol as % of sales` remains `Over 50%` for the existing E&S and restaurant autoquote routing guards. The ordinary `/restaurant` form retains its existing buckets.

The bar form asks `What would you like us to quote?` with multiple choices: Liquor liability, General liability, Business property (equipment, furniture, inventory), Building (for owners), or the exclusive Help me decide choice. The exact choices are saved as `Coverage requested`. General liability plus business property is sent as the CRM `BOP` line for review; liquor liability is an independent line. Building is offered only when the visitor owns the space and is also preserved as a separate detail. Help me decide maps to `Other`, avoiding an invented GL request.

`bar-landing` alone can forward the added Property, BOP, Liquor Liability and Other line names. All other intake sources retain the original narrow coverage allowlist. This mapping is a requested-scope record, not proof that a particular insurer will offer or include the coverage. No client contact or automatic bind, pay or sign is authorized by the form.

The paid `/bar` step form asks email, phone and full name before business questions. If a visitor leaves or is idle for two minutes after entering a valid email or phone, the existing partial-capture path sends one snapshot to quotes@ only. It does not create a completed CRM lead or a Meta `Lead` conversion. An unanswered business type is omitted from a bar partial rather than inferred from the page; a restaurant visitor can still identify their actual type on the form. The `/restaurant` step order is unchanged.

# Session 04 coordination

Exclusive Auto application writes from this worker are paused after overlapping remote commit bb04d80cfbd1ee0a87551543f48aa3af3c54c357 changed the three Carwow catalogue adapters. This worker published cf099f656b5aa015f9e3f371296437d3b22c4a8b (Carwow identity). Its further prepared source changes are preserved in carwow-prepared-cf099.json for selective review, NOT applied and NOT a second application copy or a completed build. Do not overwrite current source with this snapshot.

This worker is proceeding only with NEXT CAR / clients/next-car-banovo, which had no folder at the fresh read. Before any other worker starts that account, inspect its current files and this coordination note. Exclusive Auto remains with the publisher of bb04d80. Other accounts will be rechecked before moving on. All work stays on codex/astra-bg-04; no local checkout is changed.

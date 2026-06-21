# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "python"))
import converter

sample = """# Title

## Sub

### Deep

- [x] done
- [ ] todo

> quote

**bold** and *italic* and ~~strike~~

[link](https://x.com)

![alt text](https://x.com/img.png)

| A | B |
| -- | -- |
| 1 | 2 |

```py
print(1)
```
"""

for mode in ["normal", "clean", "structured"]:
    print("==== mode=" + mode + " ====")
    print(converter.convert(sample, {"mode": mode, "keep_task_lists": True, "keep_headings": True}))
    print()

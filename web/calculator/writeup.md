`json.dumps` outputs `NaN` and `Infinity`, which aren't syntax errors. You can still get `math.inf` by doing `1.0 / 5e-324`.

Flag template: `sdctf{there_was_once_a_cpp_stackoverflow_guy_who_was_super_pedantic_about_floats}`

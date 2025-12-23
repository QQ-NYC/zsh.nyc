import { test, expect } from "vitest";
import React from "react";
import { render } from "ink-testing-library";
import { HyperRegistryApp } from "../hyper-registry";

test("hyper registry app renders", () => {
  const { lastFrame } = render(<HyperRegistryApp />);
  expect(lastFrame()).toMatch(/Universal Hyper Registry/);
  expect(lastFrame()).toMatch(/Dashboard Overview/);
});
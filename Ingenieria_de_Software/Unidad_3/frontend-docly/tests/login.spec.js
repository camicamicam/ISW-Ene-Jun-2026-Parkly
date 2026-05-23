import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('https://docly-itq.firebaseapp.com/');
  
  //await page.getByRole('link', { name: 'Cursos Profesional ▼' }).hover();
  await page.locator('.dropdown:has-text("Cursos Profesional")').hover();
  await page.waitForTimeout(2000);
  await page.locator('.dropdown:has-text("Cursos Profesional")').getByRole('link', { name: 'Instructor' }).click();
  await page.waitForSelector('input[type="password"], textbox[name*="clave"]', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1500);
  
  await page.getByRole('textbox', { name: 'Ingrese su clave' }).click();
  await page.getByRole('textbox', { name: 'Ingrese su clave' }).fill('pasdfghjk'); //Probando para una clave incorrecta
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1500);
  const mensajeError = page.getByText('Credencial incorrecta, revisa');
  await expect(mensajeError).toBeVisible();
  await page.waitForTimeout(1500);
  await page.getByRole('textbox', { name: 'Ingrese su clave' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('textbox', { name: 'Ingrese su clave' }).fill('password'); //Probando con una clave correcta
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1500);
  const tituloInstructor = page.getByRole('heading', { name: 'Información del Curso' });
  await expect(tituloInstructor).toBeVisible({ timeout: 5000 });
});